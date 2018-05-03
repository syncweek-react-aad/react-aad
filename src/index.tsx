import * as Msal from 'msal';
import * as React from 'react';
import { Store } from 'redux';
import { AAD_LOGIN_SUCCESS, loginSuccessful, logoutSuccessful } from './actions';
import { Logger } from './logger';

enum LoginType {
  Popup,
  Redirect,
}

enum AuthenticationState {
  Unauthenticated,
  Authenticating,
  Authenticated,
}

type UserInfoCallback = (token: IUserInfo) => void;

type UnauthenticatedFunction = (login: LoginFunction) => JSX.Element;

type AuthenticatedFunction = (logout: LogoutFunction) => JSX.Element;

type LoginFunction = () => void;

type LogoutFunction = () => void;

interface IProps {
  clientID: string,
  scopes: string[],
  unauthenticatedFunction: UnauthenticatedFunction,
  authenticatedFunction: AuthenticatedFunction,
  userInfoCallback: UserInfoCallback,
  reduxStore?: Store
  authority?: string,
  type?: LoginType,
}

interface IState {
  authenticationState: AuthenticationState,
}

interface IUserInfo {
  jwtAccessToken: string,
  jwtIdToken: string,
  user: Msal.User,
}

interface IRedirectLogin {
  error: string,
  errorDesc: string,
  idToken: string,
  tokenType: string,
}

class AzureAD extends React.Component<IProps, IState> {

  private clientApplication: Msal.UserAgentApplication;
  private redirectLoginInfo: IRedirectLogin;

  constructor(props: IProps) {
    super(props);

    let authenticationState = AuthenticationState.Unauthenticated;
    this.clientApplication = new Msal.UserAgentApplication(
      props.clientID,
      props.authority ? props.authority : null, 
      (errorDesc: string, idToken: string, error: string, tokenType: string) => {
        this.redirectLoginInfo = {
          error,
          errorDesc,
          idToken,
          tokenType
        }
        authenticationState = AuthenticationState.Authenticating;
      }
    );

    this.state = { authenticationState };
  }

  public render() {
    switch (this.state.authenticationState) {
      case AuthenticationState.Authenticated:
        return this.props.authenticatedFunction(this.logout);
      case AuthenticationState.Authenticating:
        // TODO: Add loading callback, componentDidMount will acquire tokens and then re-render
        return null;
      case AuthenticationState.Unauthenticated:
      default:
        return this.props.unauthenticatedFunction(this.login);
    }
  }

  public componentDidMount() {
    if (this.redirectLoginInfo) {
      if (this.redirectLoginInfo.idToken) {
        this.acquireTokens(this.redirectLoginInfo.idToken);
      }
      else if (this.redirectLoginInfo.errorDesc || this.redirectLoginInfo.error) {
        Logger.error(`Error doing login redirect; errorDescription=${this.redirectLoginInfo.errorDesc}, error=${this.redirectLoginInfo.error}`);
      }
    }
  }

  public createUserInfo = (accessToken: string, idToken: string, msalUser: Msal.User): IUserInfo => {
    const user: IUserInfo = {
      jwtAccessToken: accessToken,
      jwtIdToken: idToken,
      user: msalUser
    };

    return user;
  }

  public resetUserInfo = () => {
      if (this.props.reduxStore) {
        this.props.reduxStore.dispatch(logoutSuccessful());
      }

      this.setState({
        authenticationState: AuthenticationState.Unauthenticated,
      });
  }

  private acquireTokens = (idToken: string) => {
    this.clientApplication.acquireTokenSilent(this.props.scopes)
      .then((accessToken: string) => {
        const user = this.createUserInfo(accessToken, idToken, this.clientApplication.getUser());
        // Send userInfo first before we set state and rerender 
        this.props.userInfoCallback(user);

        this.setState({
          authenticationState: AuthenticationState.Authenticated,
        });
    
        this.dispatchToProvidedReduxStore(user);
      }, (tokenSilentError) => {
        Logger.error(`token silent error; ${tokenSilentError}`);
        this.clientApplication.acquireTokenPopup(this.props.scopes)
          .then((accessToken: string) => {
            this.createUserInfo(accessToken, idToken, this.clientApplication.getUser());
          }, (tokenPopupError) => {
            Logger.error(`token popup error; ${tokenPopupError}`);
          });
      });
  }

  private login = () => {
    if (this.props.type === LoginType.Popup) {
      this.clientApplication.loginPopup(this.props.scopes)
        .then((idToken: string) => {
          this.acquireTokens(idToken);
        }, (error) => {
          Logger.error(`Login popup failed; ${error}`);
        });
    } else {
      this.clientApplication.loginRedirect(this.props.scopes);
    }
  };

  private logout = () => {
    if (!this.state.authenticationState) {return;}
    else {
      this.resetUserInfo();
      this.clientApplication.logout();
    }
  };

  private dispatchToProvidedReduxStore(data: IUserInfo) {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(loginSuccessful(data))
    }
  }
}

export { AzureAD, LoginType, IUserInfo, UnauthenticatedFunction, LoginFunction, AAD_LOGIN_SUCCESS };
export default AzureAD;
