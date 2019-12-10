import { AuthError } from 'msal';
import { AnyAction } from 'redux';
import { AccessTokenResponse } from './AccessTokenResponse';
import { IdTokenResponse } from './IdTokenResponse';
import { AuthenticationState, IAccountInfo } from './Interfaces';

export enum AuthenticationActions {
  Initializing = 'AAD_INITIALIZING',
  Initialized = 'AAD_INITIALIZED',
  LoginSuccess = 'AAD_LOGIN_SUCCESS',
  LoginFailed = 'AAD_LOGIN_FAILED',
  LoginError = 'AAD_LOGIN_ERROR',
  ClearError = 'AAD_CLEAR_ERROR',
  LogoutSuccess = 'AAD_LOGOUT_SUCCESS',
  AcquiredIdTokenSuccess = 'AAD_ACQUIRED_ID_TOKEN_SUCCESS',
  AcquiredIdTokenError = 'AAD_ACQUIRED_ID_TOKEN_ERROR',
  AcquiredAccessTokenSuccess = 'AAD_ACQUIRED_ACCESS_TOKEN_SUCCESS',
  AcquiredAccessTokenError = 'AAD_ACQUIRED_ACCESS_TOKEN_ERROR',
  AuthenticatedStateChanged = 'AAD_AUTHENTICATED_STATE_CHANGED',
}

export abstract class AuthenticationActionCreators {
  public static initializing = (): AnyAction => ({
    type: AuthenticationActions.Initializing,
  });

  public static initialized = (): AnyAction => ({
    type: AuthenticationActions.Initialized,
  });

  public static loginSuccessful = (data: IAccountInfo): AnyAction => ({
    payload: data,
    type: AuthenticationActions.LoginSuccess,
  });

  public static loginFailed = (): AnyAction => ({
    type: AuthenticationActions.LoginFailed,
  });

  public static loginError = (error: AuthError): AnyAction => ({
    payload: error,
    type: AuthenticationActions.LoginError,
  });

  public static clearError = (): AnyAction => ({
    type: AuthenticationActions.ClearError,
  });

  public static logoutSuccessful = (): AnyAction => ({
    type: AuthenticationActions.LogoutSuccess,
  });

  public static acquireIdTokenSuccess = (token: IdTokenResponse): AnyAction => ({
    payload: token,
    type: AuthenticationActions.AcquiredIdTokenSuccess,
  });

  public static acquireIdTokenError = (error: AuthError): AnyAction => ({
    payload: error,
    type: AuthenticationActions.AcquiredIdTokenError,
  });

  public static acquireAccessTokenSuccess = (token: AccessTokenResponse): AnyAction => ({
    payload: token,
    type: AuthenticationActions.AcquiredAccessTokenSuccess,
  });

  public static acquireAccessTokenError = (error: AuthError): AnyAction => ({
    payload: error,
    type: AuthenticationActions.AcquiredAccessTokenError,
  });

  public static authenticatedStateChanged = (state: AuthenticationState): AnyAction => ({
    payload: state,
    type: AuthenticationActions.AuthenticatedStateChanged,
  });
}
