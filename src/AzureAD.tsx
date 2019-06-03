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

import { loginSuccessful, logoutSuccessful } from './actions';
import { AccountInfoCallback, AuthenticationState, IAccountInfo, IAuthProvider, IAuthProviderFactory } from './Interfaces';



type UnauthenticatedFunction = (login: LoginFunction) => JSX.Element;
type AuthenticatedFunction = (logout: LogoutFunction) => JSX.Element;
type LoginFunction = () => void;
type LogoutFunction = () => void;

interface IProps {
  provider: IAuthProviderFactory,
  unauthenticatedFunction?: UnauthenticatedFunction,
  authenticatedFunction?: AuthenticatedFunction,
  accountInfoCallback?: AccountInfoCallback,
  reduxStore?: Store,
  forceLogin?: boolean
}

interface IState {
  authenticationState: AuthenticationState,
}

class AzureAD extends React.Component<IProps, IState> {
  private authProvider: IAuthProvider;

  constructor(props: IProps) {
    super(props);

    this.authProvider = this.props.provider.getAuthProvider();
    this.authProvider.onAuthenticationStateChanged = this.updateAuthenticationState;

    this.state = { authenticationState: this.authProvider.authenticationState }

    if (this.props.forceLogin && this.state.authenticationState === AuthenticationState.Unauthenticated) {
      this.login();
    }
  }

  public render() {
    switch (this.state.authenticationState) {
      case AuthenticationState.Authenticated:
        if (this.props.authenticatedFunction) {
          return this.props.authenticatedFunction(this.logout) || null;
        }
        else {
          return this.props.children || null;
        }
      case AuthenticationState.Unauthenticated:
        if (this.props.unauthenticatedFunction) {
          return this.props.unauthenticatedFunction(this.login) || null;
        } else {
          return null;
        }
      case AuthenticationState.Authenticating:
        // TODO: Add loading callback, componentDidMount will acquire tokens and then re-render
      default:
        return null;
    }
  }

  public resetAccountInfo = () => {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(logoutSuccessful());
    }
  }

  public updateAuthenticationState = (state: AuthenticationState, user?: IAccountInfo) => {
    if (user) {
      this.dispatchToProvidedReduxStore(user);
    }
    this.setState({
      authenticationState: state
    },
    ()=> {
      if (user && this.props.accountInfoCallback) {
          this.props.accountInfoCallback(user);
      }
    });

  }

  private login = () => {
    this.authProvider.login();
  };

  private logout = () => {
    if (this.state.authenticationState !== AuthenticationState.Authenticated) {
      return;
    }

    this.resetAccountInfo();
    this.authProvider.logout();
  };

  private dispatchToProvidedReduxStore(data: IAccountInfo) {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(loginSuccessful(data))
    }
  }
}

export { AzureAD }