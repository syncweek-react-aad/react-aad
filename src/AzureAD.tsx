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

import { AccountInfoCallback, AuthenticationState, IAccountInfo, IAuthProviderFactory } from './Interfaces';
import { MsalAuthProvider } from './MsalAuthProvider';

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

interface IAzureADState {
  authenticationState: AuthenticationState
}

class AzureAD extends React.Component<IAzureADProps, IAzureADState> {
  private authProvider: MsalAuthProvider = this.props.provider.getAuthProvider();

  // tslint:disable-next-line: member-ordering
  public state: Readonly<IAzureADState> = {
    authenticationState: this.authProvider.authenticationState
  };

  constructor(props: IAzureADProps) {
    super(props);

    this.authProvider.onAuthenticationStateChanged = this.setAuthenticationState;
    this.authProvider.onAccountInfoChanged = this.onAccountInfoChanged;

    if (props.reduxStore) {
      this.authProvider.registerReduxStore(props.reduxStore);
    }

    const { authenticationState } = this.state;
    if (authenticationState === AuthenticationState.Authenticated) {
      const accountInfo = this.authProvider.getAccountInfo();
      if (accountInfo && props.accountInfoCallback) {
        this.onAccountInfoChanged(accountInfo);
      }
    } else if (authenticationState === AuthenticationState.Unauthenticated) {
      if (props.forceLogin) {
        this.login();
      }
    }
  }

  public render() {
    const { authenticatedFunction, unauthenticatedFunction, children } = this.props;
    switch (this.state.authenticationState) {
      case AuthenticationState.Authenticated:
        if (authenticatedFunction) {
          return authenticatedFunction(this.logout) || children;
        }
        else {
          return children || null;
        }
      case AuthenticationState.Unauthenticated:
        if (unauthenticatedFunction) {
          return unauthenticatedFunction(this.login) || null;
        } else {
          return null;
        }
      default:
        return null;
    }
  }

  public setAuthenticationState = (newState: AuthenticationState) => {
    if (newState !== this.state.authenticationState) {
      this.setState({ authenticationState: newState }, () => {
        if (newState === AuthenticationState.Unauthenticated && this.props.forceLogin) {
          this.login();
        }
      });
    }
  }

  public onAccountInfoChanged = (newAccountInfo: IAccountInfo) => {
    const { accountInfoCallback } = this.props;

    if (accountInfoCallback) {
      accountInfoCallback(newAccountInfo);
    }
  }

  private login = () => {
    this.authProvider.login();
  };

  private logout = () => {
    if (this.state.authenticationState !== AuthenticationState.Authenticated) {
      return;
    }

    this.authProvider.logout();
  };
}

export { AzureAD }