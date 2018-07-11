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
import { IAuthProvider, IMsalAuthProviderConfig, IUserInfo } from "./Interfaces";
import { Logger } from './logger';

const IDTokenKey = "msal.idtoken";

const StorageLocations: {localStorage: string, sessionStorage: string}  = {
  localStorage: "localStorage",
  sessionStorage: "sessionStorage"
}

export abstract class MsalAuthProvider implements IAuthProvider {
  public userInfoChangedCallback : (userInfo: IUserInfo) => void;

  protected clientApplication: Msal.UserAgentApplication;
  protected config: IMsalAuthProviderConfig;
  protected userInfo : IUserInfo;

  constructor(authProviderConfig : IMsalAuthProviderConfig) {
    this.config = authProviderConfig;

    this.clientApplication = new Msal.UserAgentApplication(
      authProviderConfig.clientID,
      authProviderConfig.authority ? authProviderConfig.authority : null,
      this.tokenRedirectCallback,
      {
        cacheLocation: authProviderConfig.persistLoginPastSession ? StorageLocations.localStorage : StorageLocations.sessionStorage,
        redirectUri: authProviderConfig.redirectUri
      }
    );
  }

  public abstract login() : void;

  public logout(): void {
    this.clientApplication.logout();
  }

  public getUserInfo() : IUserInfo {
    return this.userInfo;
  }

  protected tokenRedirectCallback(errorDesc: string, idToken: string, error: string, tokenType: string) : void {
    // Empty callback by default
  }
  
  protected checkIfUserAuthenticated = () => {
    if (this.isLoggedIn()) {
      const idToken = this.getCacheItem(this.clientApplication.cacheLocation, IDTokenKey);
      this.acquireTokens(idToken!);
    }
  }

  protected acquireTokens = (idToken: string) => {
    this.clientApplication.acquireTokenSilent(this.config.scopes)
      .then((accessToken: string) => {
        this.saveUserInfo(accessToken, idToken, this.clientApplication.getUser());
      }, (tokenSilentError) => {
        Logger.error(`token silent error; ${tokenSilentError}`);
        this.clientApplication.acquireTokenPopup(this.config.scopes)
          .then((accessToken: string) => {
            this.saveUserInfo(accessToken, idToken, this.clientApplication.getUser());
          }, (tokenPopupError) => {
            Logger.error(`token popup error; ${tokenPopupError}`);
          });
      });
  }

  private saveUserInfo = (accessToken: string, idToken: string, msalUser: Msal.User): void => {
    const user: IUserInfo = {
      jwtAccessToken: accessToken,
      jwtIdToken: idToken,
      user: msalUser
    };

    this.userInfo = user;
    if (this.userInfoChangedCallback) {
      this.userInfoChangedCallback(user);
    }
  }
  
  // a person is logged in if UserAgentApplication has a current user, if there is an idtoken in the cache, and if the token in the cache is not expired
  private isLoggedIn = () => {
    const potentialLoggedInUser = this.clientApplication.getUser();
    if (potentialLoggedInUser) {
      const idToken = this.getCacheItem(this.clientApplication.cacheLocation, IDTokenKey);
      const oldIDToken = potentialLoggedInUser.idToken as any;
      if (oldIDToken.exp && idToken) {
        const expirationInMs = oldIDToken.exp * 1000; // AD returns in seconds
        if (Date.now() < expirationInMs) { // id token isn't expired
          return true;
        }
      }
    }
    return false;
  }

  private getCacheItem = (storageLocation: string, itemKey: string): string | null => {
    if (storageLocation === StorageLocations.localStorage) {
      return localStorage.getItem(itemKey);
    } else if (storageLocation === StorageLocations.sessionStorage) {
      return sessionStorage.getItem(itemKey)
    } else {
      throw new Error("unrecognized storage location");
    }
  }
}