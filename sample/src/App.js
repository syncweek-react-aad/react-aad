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

import React, { Component } from 'react';
import { AzureAD, AuthenticationState } from 'react-aad-msal';
import { basicReduxStore } from './reduxStore';

// Import the authentication provider which holds the default settings
import { authProvider } from './authProvider';

import SampleAppButtonLaunch from './SampleAppButtonLaunch';
import SampleAppRedirectOnLaunch from './SampleAppRedirectOnLaunch';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountInfo: null,
      sampleType: null,
    };

    const sampleType = localStorage.getItem('sampleType');
    if (sampleType) {
      this.state.sampleType = sampleType;
    }
  }

  handleClick = sampleType => {
    this.setState({ sampleType });
    localStorage.setItem('sampleType', sampleType);
  };

  render() {
    let sampleBox;

    switch (this.state.sampleType) {
      case 'popup':
        sampleBox = (
          <div className="SampleBox">
            <h2 className="SampleHeader">Button Login</h2>
            <p>This example will launch a popup dialog to allow for authentication with Azure Active Directory</p>
            <SampleAppButtonLaunch />
          </div>
        );
        break;
      case 'redirect':
        sampleBox = (
          <div className="SampleBox">
            <h2 className="SampleHeader">Automatic Redirect</h2>
            <p>
              This example shows how you can use the AzureAD component to redirect the login screen automatically on
              page load. Click the checkbox below to enable the redirect and refresh your browser window.
            </p>
            <SampleAppRedirectOnLaunch accountInfo={this.state.accountInfo} />
          </div>
        );
        break;
      default:
        break;
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the react-aad-msal sample</h1>
        </header>

        <AzureAD provider={authProvider} reduxStore={basicReduxStore}>
          {({ accountInfo, authenticationState }) => {
            console.log('READONLY COMP:', authenticationState);
            console.log(accountInfo);
            return (
              <React.Fragment>
                {authenticationState === AuthenticationState.Unauthenticated && (
                  <div>
                    <button onClick={() => this.handleClick('popup')} className="Button">
                      Popup Sample
                    </button>{' '}
                    <button onClick={() => this.handleClick('redirect')} className="Button">
                      Redirect Sample
                    </button>
                  </div>
                )}

                <div className="SampleContainer">
                  {sampleBox}
                  <div className="SampleBox">
                    <h2 className="SampleHeader">Authenticated Values</h2>
                    <p>When logged in, this box will show your tokens and user info</p>
                    {accountInfo && (
                      <div style={{ wordWrap: 'break-word' }}>
                        <p>
                          <span style={{ fontWeight: 'bold' }}>User Information:</span>
                        </p>
                        <p>
                          <span style={{ fontWeight: 'bold' }}>ID Token:</span> {accountInfo.jwtIdToken}
                        </p>
                        <p>
                          <span style={{ fontWeight: 'bold' }}>Username:</span> {accountInfo.account.userName}
                        </p>
                        <p>
                          <span style={{ fontWeight: 'bold' }}>Access Token:</span> {accountInfo.jwtAccessToken}
                        </p>
                        <p>
                          <span style={{ fontWeight: 'bold' }}>Name:</span> {accountInfo.account.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          }}
        </AzureAD>
      </div>
    );
  }
}

export default App;
