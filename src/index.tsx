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

import * as React from 'react';
import { Store } from 'redux';
import { AAD_LOGIN_SUCCESS, loginSuccessful, logoutSuccessful } from './actions';
import { AuthenticatedFunction, AuthenticationState, IAuthProvider , IUserInfo, LoginType, UnauthenticatedFunction, UserInfoCallback} from './Interfaces';
import { MsalPopupAuthProvider } from './MsalPopupAuthProvider';

interface IProps {
  clientID: string,
  scopes: string[],
  unauthenticatedFunction: UnauthenticatedFunction,
  authenticatedFunction: AuthenticatedFunction,
  userInfoCallback: UserInfoCallback,
  reduxStore?: Store
  authority?: string,
  type?: LoginType,
  persistLoginPastSession?: boolean
}

interface IState {
  authenticationState: AuthenticationState,
}

class AzureAD extends React.Component<IProps, IState> {
  private authProvider : IAuthProvider;

  constructor(props: IProps) {
    super(props);

    const authenticationState = AuthenticationState.Unauthenticated;

    this.authProvider = new MsalPopupAuthProvider({
      authority: props.authority,
      clientID: props.clientID,
      persistLoginPastSession: props.persistLoginPastSession,
      scopes: props.scopes,
    });
    this.authProvider.init();

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
    this.sendUserInfo();
  }

  public sendUserInfo = (): void => {
    const user : IUserInfo = this.authProvider.getUserInfo();
    if (user) {
      this.props.userInfoCallback(user);

      this.dispatchToProvidedReduxStore(user);
      this.setState({
        authenticationState: AuthenticationState.Authenticated
      })
    }
  }

  public resetUserInfo = () => {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(logoutSuccessful());
    }

    this.setState({
      authenticationState: AuthenticationState.Unauthenticated,
    });
  }

  private login = () => {
    this.authProvider.login();
    this.sendUserInfo();
  };

  private logout = () => {
    if (this.state.authenticationState !== AuthenticationState.Authenticated) {
      return;
    }

    this.resetUserInfo();
    this.authProvider.logout();
  };

  private dispatchToProvidedReduxStore(data: IUserInfo) {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(loginSuccessful(data))
    }
  }
}

export { AzureAD, AAD_LOGIN_SUCCESS };
export default AzureAD;
