import {
  AuthenticationParameters,
  AuthError,
  AuthResponse,
  ClientAuthError,
  Configuration,
  InteractionRequiredAuthError,
  UserAgentApplication,
} from 'msal';
import { AnyAction, Store } from 'redux';

import { AccessTokenResponse } from './AccessTokenResponse';
import { AuthenticationActionCreators } from './AuthenticationActionCreators';
import { IdTokenResponse } from './IdTokenResponse';
import { IAccountInfo, IAuthProvider, IMsalAuthProviderConfig } from './interfaces';
import { Logger } from './Logger';
import { AuthenticationState, LoginType, TokenType } from './enums';

type AuthenticationStateHandler = (state: AuthenticationState) => void;
type ErrorHandler = (error: AuthError | null) => void;
type AccountInfoHandlers = (accountInfo: IAccountInfo | null) => void;

export class MsalAuthProvider extends UserAgentApplication implements IAuthProvider {
  public authenticationState: AuthenticationState;

  /**
   * Gives access to the MSAL functionality for advanced usage.
   *
   * @deprecated The MsalAuthProvider class itself extends from UserAgentApplication and has the same functionality
   */
  public UserAgentApplication: UserAgentApplication;

  protected _reduxStore: Store;
  protected _parameters: AuthenticationParameters;
  protected _options: IMsalAuthProviderConfig;
  protected _accountInfo: IAccountInfo | null;
  protected _error: AuthError | null;

  private _onAuthenticationStateHandlers = new Set<AuthenticationStateHandler>();
  private _onAccountInfoHandlers = new Set<AccountInfoHandlers>();
  private _onErrorHandlers = new Set<ErrorHandler>();
  private _actionQueue: AnyAction[] = [];

  constructor(
    config: Configuration,
    parameters: AuthenticationParameters,
    options: IMsalAuthProviderConfig = {
      loginType: LoginType.Popup,
      tokenRefreshUri: window.location.origin,
    },
  ) {
    super(config);

    // Required only for backward compatibility
    this.UserAgentApplication = this as UserAgentApplication;

    this.setAuthenticationParameters(parameters);
    this.setProviderOptions(options);

    this.initializeProvider();
  }

  public login = async (parameters?: AuthenticationParameters) => {
    const params = parameters || this._parameters;

    // Clear any active authentication errors unless the code is executing from within
    // the token renewal iframe
    const error = this.getError();
    if (error && error.errorCode !== 'block_token_requests') {
      this.setError(null);
    }

    if (this._options.loginType === LoginType.Redirect) {
      this.setAuthenticationState(AuthenticationState.InProgress);
      try {
        this.loginRedirect(params);
      } catch (error) {
        Logger.ERROR(error);

        this.setError(error);
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
      }
    } else if (this._options.loginType === LoginType.Popup) {
      try {
        this.setAuthenticationState(AuthenticationState.InProgress);
        await this.loginPopup(params);
      } catch (error) {
        Logger.ERROR(error);

        this.setError(error);
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
      }

      await this.processLogin();
    }
  };

  public logout = (): void => {
    super.logout();

    this.dispatchAction(AuthenticationActionCreators.logoutSuccessful());
  };

  public getAccountInfo = (): IAccountInfo | null => this._accountInfo;

  public getAccessToken = async (parameters?: AuthenticationParameters): Promise<AccessTokenResponse> => {
    const params = parameters || this._parameters;

    // Use the redirectUri that was passed, otherwise use the configured tokenRefreshUri
    params.redirectUri = (parameters && parameters.redirectUri) || this._options.tokenRefreshUri;

    try {
      const response = await this.acquireTokenSilent(params);

      this.handleAcquireTokenSuccess(response);
      this.setAuthenticationState(AuthenticationState.Authenticated);

      return new AccessTokenResponse(response);
    } catch (error) {
      this.dispatchAction(AuthenticationActionCreators.acquireAccessTokenError(error));
      const response = await this.loginToRefreshToken(error, params);
      return new AccessTokenResponse(response);
    }
  };

  public getIdToken = async (parameters?: AuthenticationParameters): Promise<IdTokenResponse> => {
    const config = this.getCurrentConfiguration();
    const clientId = config.auth.clientId;

    let params = parameters || this._parameters;
    params = {
      ...params,
      redirectUri: (parameters && parameters.redirectUri) || this._options.tokenRefreshUri,
      // Pass the clientId as the only scope to get a renewed IdToken if it has expired
      scopes: [clientId],
    };

    // If the parameters do not specify a login hint and the user already has a session cached,
    // prefer the cached user name to bypass the account selection process if possible
    const account = this.getAccount();
    if (account && (!parameters || !parameters.loginHint)) {
      params.loginHint = account.userName;
    }

    try {
      const response = await this.acquireTokenSilent(params);

      this.handleAcquireTokenSuccess(response);
      this.setAuthenticationState(AuthenticationState.Authenticated);

      return new IdTokenResponse(response);
    } catch (error) {
      this.dispatchAction(AuthenticationActionCreators.acquireIdTokenError(error));
      const response = await this.loginToRefreshToken(error, this._parameters);
      return new IdTokenResponse(response);
    }
  };

  public getAuthenticationParameters = (): AuthenticationParameters => this._parameters;

  public getError = () => this._error;

  public setAuthenticationParameters = (parameters: AuthenticationParameters): void => {
    this._parameters = parameters;
  };

  public getProviderOptions = (): IMsalAuthProviderConfig => this._options;

  public setProviderOptions = (options: IMsalAuthProviderConfig) => {
    this._options = options;
    if (options.loginType === LoginType.Redirect) {
      this.handleRedirectCallback(this.authenticationRedirectCallback);
    }
  };

  public registerReduxStore = (store: Store): void => {
    this._reduxStore = store;
    while (this._actionQueue.length) {
      const action = this._actionQueue.shift();
      if (action) {
        this.dispatchAction(action);
      }
    }
  };

  public registerAuthenticationStateHandler = (listener: AuthenticationStateHandler) => {
    this._onAuthenticationStateHandlers.add(listener);
    listener(this.authenticationState);
  };

  public unregisterAuthenticationStateHandler = (listener: AuthenticationStateHandler) => {
    this._onAuthenticationStateHandlers.delete(listener);
  };

  public registerAcountInfoHandler = (listener: AccountInfoHandlers) => {
    this._onAccountInfoHandlers.add(listener);
    listener(this._accountInfo);
  };

  public unregisterAccountInfoHandler = (listener: AccountInfoHandlers) => {
    this._onAccountInfoHandlers.delete(listener);
  };

  public registerErrorHandler = (listener: ErrorHandler) => {
    this._onErrorHandlers.add(listener);
    listener(this._error);
  };

  public unregisterErrorHandler = (listener: ErrorHandler) => {
    this._onErrorHandlers.delete(listener);
  };

  private setError = (error: AuthError | null) => {
    this._error = error;

    if (error) {
      this.dispatchAction(AuthenticationActionCreators.loginError(error));
    }

    this._onErrorHandlers.forEach(listener => listener(this._error));

    return this._error;
  };

  private loginToRefreshToken = async (
    error: AuthError,
    parameters?: AuthenticationParameters,
  ): Promise<AuthResponse> => {
    const params = parameters || this._parameters;

    if (error instanceof InteractionRequiredAuthError) {
      if (this._options.loginType === LoginType.Redirect) {
        this.acquireTokenRedirect(params);

        // Nothing to return, the user is redirected to the login page
        return new Promise<AuthResponse>(resolve => resolve());
      }

      try {
        const response = await this.acquireTokenPopup(params);
        this.handleAcquireTokenSuccess(response);
        this.setAuthenticationState(AuthenticationState.Authenticated);

        return response;
      } catch (error) {
        Logger.ERROR(error);

        this.setError(error);
        this.setAuthenticationState(AuthenticationState.Unauthenticated);

        throw error;
      }
    } else {
      Logger.ERROR(error as any);

      this.setError(error);
      this.setAuthenticationState(AuthenticationState.Unauthenticated);

      throw error;
    }
  };

  private authenticationRedirectCallback = (error: AuthError) => {
    if (error) {
      this.setError(error);
    }
    this.processLogin();
  };

  private initializeProvider = async () => {
    this.dispatchAction(AuthenticationActionCreators.initializing());

    await this.processLogin();

    this.dispatchAction(AuthenticationActionCreators.initialized());
  };

  private processLogin = async () => {
    if (this.getError()) {
      this.handleLoginFailed();

      this.setAuthenticationState(AuthenticationState.Unauthenticated);
    } else if (this.getAccount()) {
      try {
        // If the IdToken has expired, refresh it. Otherwise use the cached token
        await this.getIdToken();

        this.handleLoginSuccess();
      } catch (error) {
        // Swallow the error if the user isn't authenticated, just set to Unauthenticated
        if (!(error instanceof ClientAuthError && error.errorCode === 'user_login_error')) {
          Logger.ERROR(error);
          this.setError(error);
        }

        this.setAuthenticationState(AuthenticationState.Unauthenticated);
      }
    } else if (this.getLoginInProgress()) {
      this.setAuthenticationState(AuthenticationState.InProgress);
    } else {
      this.setAuthenticationState(AuthenticationState.Unauthenticated);
    }
  };

  private setAuthenticationState = (state: AuthenticationState): AuthenticationState => {
    if (this.authenticationState !== state) {
      this.authenticationState = state;

      this.dispatchAction(AuthenticationActionCreators.authenticatedStateChanged(state));
      this._onAuthenticationStateHandlers.forEach(listener => listener(state));
    }

    return this.authenticationState;
  };

  private setAccountInfo = (response: AuthResponse): IAccountInfo => {
    const accountInfo: IAccountInfo = this.getAccountInfo() || ({ account: response.account } as IAccountInfo);

    // Depending on the token type of the auth response, update the correct property
    if (response.tokenType === TokenType.IdToken) {
      accountInfo.jwtIdToken = response.idToken.rawIdToken;
    } else if (response.tokenType === TokenType.AccessToken) {
      accountInfo.jwtAccessToken = response.accessToken;
    }

    this._accountInfo = { ...accountInfo };
    this._onAccountInfoHandlers.forEach(listener => listener(this._accountInfo));

    return this._accountInfo;
  };

  private dispatchAction = (action: AnyAction): void => {
    if (this._reduxStore) {
      this._reduxStore.dispatch(action);
    } else {
      this._actionQueue.push(action);
    }
  };

  private handleAcquireTokenSuccess = (response: AuthResponse): void => {
    this.setAccountInfo(response);

    if (response.tokenType === TokenType.IdToken) {
      const token = new IdTokenResponse(response);
      this.dispatchAction(AuthenticationActionCreators.acquireIdTokenSuccess(token));
    } else if (response.tokenType === TokenType.AccessToken) {
      const token = new AccessTokenResponse(response);
      this.dispatchAction(AuthenticationActionCreators.acquireAccessTokenSuccess(token));
    }
  };

  private handleLoginFailed = (): void => {
    const error = this.getError();
    if (error) {
      this.dispatchAction(AuthenticationActionCreators.loginFailed());
    }
  };

  private handleLoginSuccess = (): void => {
    const account = this.getAccountInfo();
    if (account) {
      this.dispatchAction(AuthenticationActionCreators.loginSuccessful(account));
    }
  };
}
