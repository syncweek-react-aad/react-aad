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

import { IMsalAuthProviderConfig } from './Interfaces';
import { Logger } from './logger';
import { MsalAuthProvider } from './MsalAuthProvider';

interface IRedirectLogin {
  error: string;
  errorDesc: string;
  idToken: string;
  tokenType: string;
}

export class MsalRedirectAuthProvider extends MsalAuthProvider {
  private redirectLoginInfo: IRedirectLogin;

  constructor(authProviderConfig: IMsalAuthProviderConfig) {
    super(authProviderConfig);
    if (this.redirectLoginInfo) {
      if (this.redirectLoginInfo.idToken) {
        this.acquireTokens(this.redirectLoginInfo.idToken);
      } else if (this.redirectLoginInfo.errorDesc || this.redirectLoginInfo.error) {
        Logger.error(
          `Error doing login redirect; errorDescription=${this.redirectLoginInfo.errorDesc}, error=${
            this.redirectLoginInfo.error
          }`,
        );
      }
    } else {
      this.checkIfUserAuthenticated();
    }
  }

  public login(): void {
    this.clientApplication.loginRedirect(this.config.scopes);
  }

  protected tokenRedirectCallback(errorDesc: string, idToken: string, error: string, tokenType: string): void {
    this.redirectLoginInfo = {
      error,
      errorDesc,
      idToken,
      tokenType,
    };
  }
}
