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
import { AuthenticationParameters, Configuration } from 'msal';
import { IAuthProvider, IAuthProviderFactory, LoginType } from './Interfaces';
import { MsalPopupAuthProvider } from './MsalPopupAuthProvider';
import { MsalRedirectAuthProvider } from './MsalRedirectAuthProvider';

export class MsalAuthProviderFactory implements IAuthProviderFactory {
  private config: Configuration;
  private authParameters: AuthenticationParameters;
  private type: LoginType;

  constructor(config: Configuration, authParams: AuthenticationParameters, type: LoginType = LoginType.Redirect) {
    this.config = config;
    this.authParameters = authParams;
    this.type = type;
  }

  public getAuthProvider(): IAuthProvider {
    if (this.type === LoginType.Popup) {
      return new MsalPopupAuthProvider(this.config, this.authParameters);
    } else {
      return new MsalRedirectAuthProvider(this.config, this.authParameters);
    }
  }
}
