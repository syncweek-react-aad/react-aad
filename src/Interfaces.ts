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

type UserInfoCallback = (token: IUserInfo) => void;
type UnauthenticatedFunction = (login: LoginFunction) => JSX.Element;
type AuthenticatedFunction = (logout: LogoutFunction) => JSX.Element;

enum LoginType {
  Popup,
  Redirect,
}

enum AuthenticationState {
  Unauthenticated,
  Authenticating,
  Authenticated,
}

type LoginFunction = () => void;

type LogoutFunction = () => void;


interface IUserInfo {
  jwtAccessToken: string,
  jwtIdToken: string,
  user: Msal.User,
}

interface IRedirectLogin {
  error: string,
  errorDesc: string,
  idToken: string,
  tokenType: string,
}

interface IMsalAuthProviderConfig {
  clientID: string;
  authority?: string;
  persistLoginPastSession?: boolean;
  scopes: string[];
  userInfoChangedCallback? : (userInfo: IUserInfo) => void;
}

interface IAuthProvider {
  getUserInfo() : IUserInfo,
  login() : void,
  logout() : void,
}

const StorageLocations: {localStorage: string, sessionStorage: string}  = {
  localStorage: "localStorage",
  sessionStorage: "sessionStorage"
}

export { AuthenticatedFunction, AuthenticationState, LoginType, IAuthProvider, IMsalAuthProviderConfig, IUserInfo, IRedirectLogin, UnauthenticatedFunction, LoginFunction, StorageLocations, UserInfoCallback }