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

import {  Account, AuthenticationParameters, AuthError, AuthResponse, CacheLocation, Configuration, UserAgentApplication  } from 'msal';
import { AuthenticationState, IAccountInfo, IAuthProvider } from './Interfaces';
import { Logger } from './logger';

const IDTokenKey = 'msal.idtoken';

const StorageLocations: { localStorage: string; sessionStorage: string } = {
  localStorage: 'localStorage',
  sessionStorage: 'sessionStorage',
};

export abstract class MsalAuthProvider implements IAuthProvider {
  public onAuthenticationStateChanged: (state: AuthenticationState, user?: IAccountInfo) => void;
  public authenticationState: AuthenticationState;
  public UserAgentApplication: UserAgentApplication;

  protected config: Configuration;
  protected authParameters: AuthenticationParameters;
  protected accountInfo: IAccountInfo;

  constructor(authProviderConfig: Configuration, authParameters: AuthenticationParameters) {
    this.config = authProviderConfig;
    this.authParameters = authParameters;

    this.UserAgentApplication = new UserAgentApplication(authProviderConfig);

    this.checkIfUserAuthenticated();
  }

  public abstract login(): void;

  public logout(): void {
    this.UserAgentApplication.logout();
  }

  public getAccountInfo(): IAccountInfo {
    return this.accountInfo;
  }

  protected acquireTokens = (idToken: string) => {
    this.UserAgentApplication.acquireTokenSilent(this.authParameters).then(
      (response: AuthResponse) => {
        this.saveAccountInfo(response.accessToken, idToken, this.UserAgentApplication.getAccount());
      },
      (tokenSilentError: AuthError) => {
        this.setAuthenticationState(AuthenticationState.Unauthenticated);
        Logger.error(`token silent error; ${tokenSilentError}`);
        this.UserAgentApplication.acquireTokenPopup(this.authParameters).then(
          (response: AuthResponse) => {
            this.saveAccountInfo(response.accessToken, idToken, this.UserAgentApplication.getAccount());
          },
          (tokenPopupError: AuthError) => {
            this.setAuthenticationState(AuthenticationState.Unauthenticated);
            Logger.error(`token popup error; ${tokenPopupError}`);
          },
        );
      },
    );
  };

  private checkIfUserAuthenticated = () => {
    const cacheOptions = this.UserAgentApplication.getCurrentConfiguration().cache;
    const cacheLocation: CacheLocation =
      cacheOptions && cacheOptions.cacheLocation ? cacheOptions.cacheLocation : 'sessionStorage';

    if (this.isLoggedIn()) {
      const idToken = this.getCacheItem(cacheLocation, IDTokenKey);
      this.acquireTokens(idToken!);
    } else if (this.UserAgentApplication.getLoginInProgress()) {
      this.setAuthenticationState(AuthenticationState.Authenticating);
    } else {
      this.setAuthenticationState(AuthenticationState.Unauthenticated);
    }
  };

  // a person is logged in if UserAgentApplication has a current user, if there is an idtoken in the cache, and if the token in the cache is not expired
  private isLoggedIn = () => {
    const cacheOptions = this.UserAgentApplication.getCurrentConfiguration().cache;
    const cacheLocation: CacheLocation =
      cacheOptions && cacheOptions.cacheLocation ? cacheOptions.cacheLocation : 'sessionStorage';
    const potentialLoggedInUser = this.UserAgentApplication.getAccount();

    if (potentialLoggedInUser) {
      const idToken = this.getCacheItem(cacheLocation, IDTokenKey);
      const oldIDToken = potentialLoggedInUser.idToken as any;
      return idToken && !this.isTokenExpired(oldIDToken);
    }

    return false;
  };

  private isTokenExpired = (token: any) => {
    if (token.exp) {
      const expirationInMs = token.exp * 1000; // AD returns in seconds
      if (Date.now() < expirationInMs) {
        // id token isn't expired
        return false;
      }
    }

    return true;
  };

  private saveAccountInfo = (accessToken: string, idToken: string, msalAccount: Account): void => {
    const user: IAccountInfo = {
      account: msalAccount,
      jwtAccessToken: accessToken,
      jwtIdToken: idToken,
    };
    this.accountInfo = user;

    this.setAuthenticationState(AuthenticationState.Authenticated);
  };

  private getCacheItem = (storageLocation: string, itemKey: string): string | null => {
    if (storageLocation === StorageLocations.localStorage) {
      return localStorage.getItem(itemKey);
    } else if (storageLocation === StorageLocations.sessionStorage) {
      return sessionStorage.getItem(itemKey);
    } else {
      throw new Error('unrecognized storage location');
    }
  };

  private setAuthenticationState(state: AuthenticationState) {
    if (this.authenticationState !== state) {
      this.authenticationState = state;

      if (this.onAuthenticationStateChanged) {
        if (this.authenticationState === AuthenticationState.Authenticated) {
          this.onAuthenticationStateChanged(this.authenticationState, this.accountInfo);
        } else {
          this.onAuthenticationStateChanged(this.authenticationState);
        }
      }
    }
  }
}
