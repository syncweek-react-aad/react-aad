import * as Msal from 'msal';
import * as React from 'react';
import { Store } from 'redux';
import { AAD_LOGIN_SUCCESS, loginSuccessful, logoutSuccessful } from './actions';
import { Logger } from './logger';

enum LoginType {
  Popup,
  Redirect,
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
  authenticated: boolean,
  userInfo: IUserInfo | null,
}

interface IUserInfo {
  jwtAccessToken: string,
  jwtIdToken: string,
  user: Msal.User,
}

class AzureAD extends React.Component<IProps, IState> {

  private clientApplication: Msal.UserAgentApplication;

  constructor(props: IProps) {
    super(props);
    this.clientApplication = new Msal.UserAgentApplication(
      props.clientID,
      props.authority ? props.authority : null,
      this.loginRedirect
    );
    this.state = {
      authenticated: false,
      userInfo: null,
    };
  }

  public render() {
    if (!this.state.authenticated) {
      return this.props.unauthenticatedFunction(this.login);
    }
    return this.props.authenticatedFunction(this.logout);
  }

  public createUserInfo = (accessToken: string, idToken: string, msalUser: Msal.User): IUserInfo => {
    const user: IUserInfo = {
      jwtAccessToken: accessToken,
      jwtIdToken: idToken,
      user: msalUser
    };
    this.setState({
      authenticated: true,
      userInfo: user
    });

    this.dispatchToProvidedReduxStore(user);

    return user;
  }

  public resetUserInfo = () => {
      if (this.props.reduxStore) {
        this.props.reduxStore.dispatch(logoutSuccessful());
      }

      this.setState({
        authenticated: false,
        userInfo: null
      });
  }

  private loginRedirect = (errorDesc: string, idToken: string, error: string, tokenType: string) => {
    if (idToken) {
      this.acquireTokens(idToken);
    }
    else if (errorDesc || error) {
      Logger.error(`Error doing login redirect; errorDescription=${errorDesc}, error=${error}`);
    }
  }

  private acquireTokens = (idToken: string) => {
    this.clientApplication.acquireTokenSilent(this.props.scopes)
      .then((accessToken: string) => {
        const user = this.createUserInfo(accessToken, idToken, this.clientApplication.getUser());
        this.props.userInfoCallback(user);
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
    if (!this.state.authenticated) {return;}
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
