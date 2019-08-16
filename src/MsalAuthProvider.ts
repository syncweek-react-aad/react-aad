//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

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
import { AuthenticationActionCreators } from './actions'
import { AuthenticationState, IAccountInfo, IAuthProvider, LoginType } from './Interfaces';
import { Logger } from './logger';

export class MsalAuthProvider extends UserAgentApplication implements IAuthProvider {
  public onAuthenticationStateChanged: (state: AuthenticationState) => void;
  public onAccountInfoChanged: (accountInfo: IAccountInfo) => void;
  public authenticationState: AuthenticationState;

  /**
   * Gives access to the MSAL functionality for advanced usage.
   * @deprecated The MsalAuthProvider class itself extends from UserAgentApplication and has the same functionality
   */
  public UserAgentApplication: UserAgentApplication;

  protected _reduxStore: Store;
  protected _parameters: AuthenticationParameters;
  protected _loginType: LoginType;
  protected _accountInfo: IAccountInfo | null;

  private _actionQueue: AnyAction[] = [];

  constructor(config: Configuration, parameters: AuthenticationParameters, loginType: LoginType) {
    super(config);

    // Required only for backward compatibility
    this.UserAgentApplication = this as UserAgentApplication;

    this.setAuthenticationParameters(parameters);
    this.setLoginType(loginType);

    this.initializeProvider();
  }

  public login = async (parameters?: AuthenticationParameters) => {
    const params = parameters ? parameters : this._parameters;

    if (this._loginType === LoginType.Redirect) {
      this.loginRedirect(this._parameters);
      // Nothing to do here, user will be redirected to the login page
    } else if (this._loginType === LoginType.Popup) {
      try {
        await this.loginPopup(params);
        this.initializeProvider(true);
      } catch (error) {
        Logger.error(error);
        this.dispatchAction(AuthenticationActionCreators.loginError(error));
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
      }
    }
  };

  public logout = (): void => {
    super.logout();

    this.dispatchAction(AuthenticationActionCreators.logoutSuccessful());
  }

  public getAccountInfo = (): IAccountInfo | null => this._accountInfo;

  public getToken = async (parameters?: AuthenticationParameters): Promise<AuthResponse> => {
    const params = parameters ? parameters : this._parameters;

    try {
      const response = await this.acquireTokenSilent(params);

      this.handleTokenRefreshSuccess(response);
      this.setAuthenticationState(AuthenticationState.Authenticated);

      return response;
    } catch (error) {
      this.dispatchAction(AuthenticationActionCreators.acquireTokenError(error));

      if (error instanceof InteractionRequiredAuthError) {
        if (this._loginType === LoginType.Redirect) {
          this.acquireTokenRedirect(params);

          // Nothing to return, the user is redirected to the login page
          return new Promise<AuthResponse>((resolve) => resolve());
        }

        try {
          const response = await this.acquireTokenPopup(params);
          this.handleTokenRefreshSuccess(response);
          this.setAuthenticationState(AuthenticationState.Authenticated);

          return response;
        } catch (error) {
          Logger.error(error);

          this.dispatchAction(AuthenticationActionCreators.loginError(error));
          this.setAuthenticationState(AuthenticationState.Unauthenticated);
          
          throw error;
        }
      } else {
        Logger.error(error);

        this.dispatchAction(AuthenticationActionCreators.loginError(error));
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
        
        throw error;
      }
    }
  };

  public getAuthenticationParameters = (): AuthenticationParameters => this._parameters;

  public setAuthenticationParameters = (parameters: AuthenticationParameters): void => {
    this._parameters = parameters;
  }

  public registerReduxStore = (store: Store): void => {
    this._reduxStore = store;
    while (this._actionQueue.length) {
        const action = this._actionQueue.shift();
        if (action) {
          this.dispatchAction(action);
        }
    }
  }

  public setLoginType = (loginType: LoginType) => {
    if (loginType === LoginType.Redirect) {
      this.handleRedirectCallback(this.authenticationRedirectCallback);
    }
    this._loginType = loginType;
  }

  private authenticationRedirectCallback = (error: AuthError, response: AuthResponse): void => {
    if (response) {
      this.initializeProvider(true);
    }
  };

  private initializeProvider = async (isLoginFlow: boolean = false) => {
    if (!isLoginFlow) {
      this.dispatchAction(AuthenticationActionCreators.initializing());
    }

    if (this.getAccount()) {
      try {
        const response = await this.acquireTokenSilent(this._parameters);
        this.handleLoginSuccess(response);
        this.setAuthenticationState(AuthenticationState.Authenticated);
      } catch (error) {
        // Swallow the error if the user isn't authenticated, just set to Unauthenticated
        if (!(error instanceof ClientAuthError && error.errorCode === 'user_login_error')) {
          Logger.error(error);
        } 
        
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
      }
    } else {
      this.setAuthenticationState(AuthenticationState.Unauthenticated);
    }

    if (!isLoginFlow) {
      this.dispatchAction(AuthenticationActionCreators.initialized());
    }
  };

  private setAuthenticationState = (state: AuthenticationState): AuthenticationState => {
    if (this.authenticationState !== state) {
      this.authenticationState = state;

      this.dispatchAction(AuthenticationActionCreators.authenticatedStateChanged(state))

      if (this.onAuthenticationStateChanged) {
        this.onAuthenticationStateChanged(state);
      }
    }

    return this.authenticationState;
  };

  private setAccountInfo = (response: AuthResponse): IAccountInfo => {
    this._accountInfo = this.mapAuthResponseToAccountInfo(response);

    if (this.onAccountInfoChanged) {
      this.onAccountInfoChanged(this._accountInfo);
    }

    return this._accountInfo;
  }

  private dispatchAction = (action: AnyAction): void => {
    if (this._reduxStore) {
      this._reduxStore.dispatch(action);
    } else {
      this._actionQueue.push(action);
    }
  }

  private mapAuthResponseToAccountInfo = (response: AuthResponse): IAccountInfo => ({
    account: response.account,
    authenticationResponse: response,
    jwtAccessToken: response.accessToken,
    jwtIdToken: response.idToken.rawIdToken
  })

  private handleTokenRefreshSuccess = (response: AuthResponse): void => {
    const account = this.setAccountInfo(response);
    this.dispatchAction(AuthenticationActionCreators.acquireTokenSuccess(account));
  }

  private handleLoginSuccess = (response: AuthResponse): void => {
    const account = this.setAccountInfo(response);
    this.dispatchAction(AuthenticationActionCreators.loginSuccessful(account));
  } 
}
