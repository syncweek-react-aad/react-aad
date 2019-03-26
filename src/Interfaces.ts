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
import * as Msal from 'msal';

export type UserInfoCallback = (token: IUserInfo) => void;

export enum LoginType {
  Popup,
  Redirect,
}

export enum AuthenticationState {
  Unauthenticated,
  Authenticating,
  Authenticated,
}

export interface IUserInfo {
  jwtAccessToken: string;
  jwtIdToken: string;
  user: Msal.User;
}

export interface IAuthProviderFactory {
  getAuthProvider(): IAuthProvider;
}

export interface IMsalAuthProviderConfig {
  clientID: string;
  authority?: string;
  persistLoginPastSession?: boolean;
  scopes: string[];
  type?: LoginType;
  validateAuthority?: boolean;
  redirectUri?: string | (() => string);
  postLogoutRedirectUri?: string | (() => string);
  loadFrameTimeout?: number;
  navigateToLoginRequestUrl?: boolean;
  state?: string;
  isAngular?: boolean;
  unprotectedResources?: string[];
  protectedResourceMap?: Map<string, string[]>;
  storeAuthStateInCookie?: boolean;
  logger?: Msal.Logger;
}

export interface IAuthProvider {
  onAuthenticationStateChanged?: (state: AuthenticationState, user?: IUserInfo) => void;
  authenticationState: AuthenticationState;

  getUserInfo(): IUserInfo;
  login(): void;
  logout(): void;
}
