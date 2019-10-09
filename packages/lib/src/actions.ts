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
