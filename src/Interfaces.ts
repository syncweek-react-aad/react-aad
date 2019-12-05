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
import { Account } from 'msal';

export type AccountInfoCallback = (token: IAccountInfo) => void;

export enum LoginType {
  Popup,
  Redirect,
}

export enum AuthenticationState {
  Unauthenticated = 'Unauthenticated',
  InProgress = 'InProgress',
  Authenticated = 'Authenticated',
}

export interface IAccountInfo {
  jwtAccessToken: string;
  jwtIdToken: string;
  account: Account;
}

export enum TokenType {
  IdToken = 'id_token',
  AccessToken = 'access_token',
}

export interface IAuthProvider {
  onAuthenticationStateChanged?: (state: AuthenticationState, account?: IAccountInfo) => void;
  authenticationState: AuthenticationState;

  getAccountInfo(): IAccountInfo | null;
  login(): void;
  logout(): void;
}

export interface IMsalAuthProviderConfig {
  // Determines whether the login process is executed in a new popup window,
  // or by redirecting to the login page
  loginType: LoginType;
  // When a token is refreshed it will be done by loading a page in an iframe.
  // Rather than reloading the same page, we can point to an empty html file which will prevent
  // site resources from being loaded twice.
  tokenRefreshUri?: string;
}
