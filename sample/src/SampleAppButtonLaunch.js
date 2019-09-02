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
import { AzureAD, LoginType, AuthenticationState } from 'react-aad-msal';
import { basicReduxStore } from './reduxStore';
import GetAccessTokenButton from './GetAccessTokenButton';
import GetIdTokenButton from './GetIdTokenButton';

// Import the authentication provider which holds the default settings
import { authProvider } from './authProvider';

class SampleAppButtonLaunch extends React.Component {
  constructor(props) {
    super(props);

    // Change the login type to execute in a Popup
    authProvider.setLoginType(LoginType.Popup);
  }

  render() {
    return (
      <AzureAD provider={authProvider} reduxStore={basicReduxStore}>
        {({ login, logout, authenticationState }) => {
          switch (authenticationState) {
            case AuthenticationState.Authenticated:
              return (
                <React.Fragment>
                  <p>You're logged in!</p>
                  <button onClick={logout} className="Button">
                    Logout
                  </button>
                  <GetAccessTokenButton provider={authProvider} />
                  <GetIdTokenButton provider={authProvider} />
                </React.Fragment>
              );
            case AuthenticationState.Unauthenticated:
              return (
                <button className="Button" onClick={login}>
                  Login
                </button>
              );
            default:
              // TODO: This should not be necessary
              //  If it is, it should be documented
              return null;
          }
        }}
      </AzureAD>
    );
  }
}
export default SampleAppButtonLaunch;
