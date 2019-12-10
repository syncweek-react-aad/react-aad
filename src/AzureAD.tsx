import { default as React, useCallback, useEffect, useMemo, useState } from 'react';
import { Store } from 'redux';

import { AuthError } from 'msal';
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
  error: AuthError | null;
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
  const [error, _setError] = useState(provider.getError());

  // On component mounted
  useEffect(() => {
    provider.registerAuthenticationStateHandler(setAuthenticationState);
    provider.registerAcountInfoHandler(onAccountInfoChanged);
    provider.registerErrorHandler(setError);

    if (props.reduxStore) {
      provider.registerReduxStore(props.reduxStore);
    }

    if (forceLogin && authenticationState === AuthenticationState.Unauthenticated && !error) {
      login();
    }

    // Cleanup on unmount
    return () => {
      provider.unregisterAuthenticationStateHandler(setAuthenticationState);
      provider.unregisterAccountInfoHandler(onAccountInfoChanged);
      provider.unregisterErrorHandler(setError);
    };
  }, [authenticationState, accountInfo, error]);

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

        if (newState === AuthenticationState.Unauthenticated && forceLogin && !error) {
          login();
        }
      }
    },
    [authenticationState, forceLogin, error],
  );

  const setError = useCallback(
    (newError: AuthError) => {
      if (newError !== error) {
        _setError(newError);
      }
    },
    [error],
  );

  const onAccountInfoChanged = useCallback(
    (newAccountInfo: IAccountInfo) => {
      _setAccountInfo(newAccountInfo);

      if (accountInfoCallback) {
        // eslint-disable-next-line no-console
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
      error,
      login,
      logout,
    }),
    [accountInfo, authenticationState, error, login, logout],
  );

  /**
   * @param children
   * @param childrenProps
   */
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

        // eslint-disable-next-line no-console
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
        // eslint-disable-next-line no-console
        console.warn(
          'Warning! The unauthenticatedFunction callback has been deprecated and will be removed in a future release.',
        );
        return unauthenticatedFunction(login) || null;
      }

      // Only return the children if it's a function to pass the current state to
      //  Otherwise the content should be restricted until authenticated
      const functionOrChildren = getChildrenOrFunction(props.children, childrenFunctionProps);
      return functionOrChildren === props.children ? null : functionOrChildren;
    case AuthenticationState.InProgress:
      return getChildrenOrFunction(props.children, childrenFunctionProps);
    default:
      return null;
  }
};

AzureAD.displayName = 'AzureAD';
