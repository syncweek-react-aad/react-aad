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

import * as React from 'react';
import { AzureAD, LoginType } from 'react-aad-msal';
import { basicReduxStore } from './reduxStore';
import GetAccessTokenButton from './GetAccessTokenButton';
import GetIdTokenButton from './GetIdTokenButton';

// Import the authentication provider factory which holds the default settings
import { authProviderFactory } from './authProviderFactory';

class SampleAppButtonLaunch extends React.Component {
  constructor(props) {
    super(props);

    // Change the login type to execute in a Popup
    const provider = authProviderFactory.getAuthProvider();
    provider.setLoginType(LoginType.Popup);
  }

  unauthenticatedFunction = loginFunction => {
    console.log('UNAUTHENTICATED');
    return (
      <button className="Button" onClick={loginFunction}>
        Login
      </button>
    );
  };

  userInfoReceived = receivedAccountInfo => {
    console.log('USER INFO RECEIVED');
    console.log(receivedAccountInfo);
    this.props.accountInfoCallback(receivedAccountInfo);
  };

  authenticatedFunction = logout => {
    console.log('AUTHENTICATED');
    return (
      <div>
        You're logged in!
        <br />
        <br />
        <button onClick={logout} className="Button">
          Logout
        </button>
        <br />
        <br />
        <GetAccessTokenButton provider={authProviderFactory} />
        <br />
        <br />
        <GetIdTokenButton provider={authProviderFactory} />
      </div>
    );
  };
  render() {
    return (
      <AzureAD
        provider={authProviderFactory}
        unauthenticatedFunction={this.unauthenticatedFunction}
        reduxStore={basicReduxStore}
        authenticatedFunction={this.authenticatedFunction}
        accountInfoCallback={this.userInfoReceived}
      />
    );
  }
}
export default SampleAppButtonLaunch;
