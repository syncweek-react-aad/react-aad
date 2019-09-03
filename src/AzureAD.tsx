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

import react, { useCallback, useEffect, useMemo, useState } from 'react';
import { Store } from 'redux';

import { MsalAuthProvider } from './';
import { AccountInfoCallback, AuthenticationState, IAccountInfo } from './Interfaces';

type UnauthenticatedFunction = (login: LoginFunction) => JSX.Element;
type AuthenticatedFunction = (logout: LogoutFunction) => JSX.Element;
type LoginFunction = () => void;
type LogoutFunction = () => void;

export interface IAzureADFunctionProps {
  login: LoginFunction;
  logout: LogoutFunction;
  authenticationState: AuthenticationState;
  accountInfo: IAccountInfo | null;
}

export interface IAzureADProps {
  provider: MsalAuthProvider;
  unauthenticatedFunction?: UnauthenticatedFunction;
  authenticatedFunction?: AuthenticatedFunction;
  accountInfoCallback?: AccountInfoCallback;
  reduxStore?: Store;
  forceLogin?: boolean;
}

export const AzureAD: React.FunctionComponent<IAzureADProps> = props => {
  const { authenticatedFunction, unauthenticatedFunction, provider, forceLogin, accountInfoCallback } = props;
  const [accountInfo, _setAccountInfo] = useState(provider.getAccountInfo());
  const [authenticationState, _setAuthenticationState] = useState(provider.authenticationState);

  // On component mounted
  useEffect(() => {
    provider.registerAuthenticationStateHandler(setAuthenticationState);
    provider.registerAcountInfoHandler(onAccountInfoChanged);

    if (props.reduxStore) {
      provider.registerReduxStore(props.reduxStore);
    }

    if (authenticationState === AuthenticationState.Unauthenticated && forceLogin) {
      login();
    }

    // Cleanup on unmount
    return () => {
      provider.unregisterAuthenticationStateHandler(setAuthenticationState);
      provider.unregisterAccountInfoHandler(onAccountInfoChanged);
    };
  }, []);

  const login = useCallback(() => {
    provider.login();
  }, [provider]);

  const logout = useCallback(() => {
    if (authenticationState !== AuthenticationState.Authenticated) {
      return;
    }
    provider.logout();
  }, [authenticationState, provider]);

  const setAuthenticationState = useCallback(
    (newState: AuthenticationState) => {
      if (newState !== authenticationState) {
        _setAuthenticationState(newState);

        if (newState === AuthenticationState.Unauthenticated && forceLogin) {
          login();
        }
      }
    },
    [authenticationState, forceLogin],
  );

  const onAccountInfoChanged = useCallback(
    (newAccountInfo: IAccountInfo) => {
      _setAccountInfo(newAccountInfo);

      if (accountInfoCallback) {
        // tslint:disable-next-line: no-console
        console.warn(
          'Warning! The accountInfoCallback callback has been deprecated and will be removed in a future release.',
        );
        accountInfoCallback(newAccountInfo);
      }
    },
    [accountInfoCallback],
  );

  // The authentication data to be passed to the children() if it's a function
  const childrenFunctionProps = useMemo<IAzureADFunctionProps>(
    () => ({
      accountInfo,
      authenticationState,
      login,
      logout,
    }),
    [accountInfo, authenticationState, login, logout],
  );

  function getChildrenOrFunction(children: any, childrenProps: IAzureADFunctionProps) {
    if (children) {
      // tslint:disable-next-line: triple-equals
      if (typeof children == 'function' || false) {
        return (children as (props: IAzureADFunctionProps) => {})(childrenProps);
      } else {
        return children;
      }
    } else {
      return null;
    }
  }

  // Render logic
  switch (authenticationState) {
    case AuthenticationState.Authenticated:
      if (authenticatedFunction) {
        const authFunctionResult = authenticatedFunction(logout);

        // tslint:disable-next-line: no-console
        console.warn(
          'Warning! The authenticatedFunction callback has been deprecated and will be removed in a future release.',
        );

        if (authFunctionResult) {
          return authFunctionResult;
        }
      }

      // If there is no authenticatedFunction, or it returned null, render the children
      return getChildrenOrFunction(props.children, childrenFunctionProps);
    case AuthenticationState.Unauthenticated:
      if (unauthenticatedFunction) {
        // tslint:disable-next-line: no-console
        console.warn(
          'Warning! The unauthenticatedFunction callback has been deprecated and will be removed in a future release.',
        );
        return unauthenticatedFunction(login) || null;
      }

      // Only return the children if it's a function to pass the current state to
      //  Otherwise the content should be restricted until authenticated
      const functionOrChildren = getChildrenOrFunction(props.children, childrenFunctionProps);
      return functionOrChildren === props.children ? null : functionOrChildren;
    default:
      return null;
  }
};
