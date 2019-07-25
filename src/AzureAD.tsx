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

export interface IAzureADProps {
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

class AzureAD extends React.Component<IAzureADProps, IState> {
  private authProvider: IAuthProvider;

  constructor(props: IAzureADProps) {
    super(props);

    this.authProvider = this.props.provider.getAuthProvider();
    this.authProvider.onAuthenticationStateChanged = this.updateAuthenticationState;

    const authState = this.authProvider.authenticationState;
    this.state = { authenticationState: authState };

    if (authState === AuthenticationState.Authenticated) {
      const account = this.authProvider.getAccountInfo();
      this.updateAuthenticationState(authState, account);
    } else if (this.state.authenticationState === AuthenticationState.Unauthenticated && this.props.forceLogin) {
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

  public updateAuthenticationState = (newState: AuthenticationState, account?: IAccountInfo) => {
    if (account) {
      this.dispatchAccountInfo(account);
    }
    
    if (newState !== this.state.authenticationState) {
      this.setState({
        authenticationState: newState
      },
      ()=> {
        this.handleAccountInfoCallback(account);
      });
    } else {
      this.handleAccountInfoCallback(account);
    }
  }

  private login = () => {
    this.authProvider.login();
  };

  private logout = () => {
    if (this.state.authenticationState !== AuthenticationState.Authenticated) {
      return;
    }

    this.dispatchLogout();
    this.authProvider.logout();
  };

  private dispatchLogout = () => {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(logoutSuccessful());
    }
  }

  private dispatchAccountInfo = (data: IAccountInfo) => {
    if (this.props.reduxStore) {
      this.props.reduxStore.dispatch(loginSuccessful(data))
    }
  }

  private handleAccountInfoCallback = (account?: IAccountInfo)  => {
    if (account && this.props.accountInfoCallback) {
      this.props.accountInfoCallback(account);
    }
  }
}

export { AzureAD }