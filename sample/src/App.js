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
import './App.css';
import SampleAppButtonLaunch from './SampleAppButtonLaunch';
import SampleAppRedirectOnLaunch from './SampleAppRedirectOnLaunch';

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      userInfo: null,
      sampleType: null
    };
  }

  userInfoCallback = (userInfo) => {
    this.setState({userInfo});
  }
  
  handleClick = (sampleType) => {
    this.setState({sampleType});
  }

  render() {
    let sampleBox;
    if (this.state.sampleType === "popup") {
      sampleBox = <div className="SampleBox">
            <h2 className="SampleHeader">Button Login</h2>
            <p>This example will launch a popup dialog to allow for authentication
              with Azure Active Directory</p>
            <SampleAppButtonLaunch userInfoCallback={this.userInfoCallback} />
          </div>
    } else if (this.state.sampleType === "redirect") {
      sampleBox = <div className="SampleBox">
            <h2 className="SampleHeader">Automatic Redirect</h2>
            <p>This example shows how you can use the AzureAD component to redirect 
              the login screen automatically on page load. Click the checkbox below 
              to enable the redirect and refresh your browser window.
            </p>
            <SampleAppRedirectOnLaunch userInfoCallback={this.userInfoCallback} userInfo={this.state.userInfo}/>
          </div>
    }

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to the react-aad-msal sample</h1>
        </header>
        <br/> <br/>
        <button onClick={() => this.handleClick("popup")} className="Button">Popup Sample</button>
        {" "}
        <button onClick={() => this.handleClick("redirect")} className="Button">Redirect Sample</button>
        <div className="SampleContainer">
          {sampleBox}
          <div className="SampleBox">
            <h2 className="SampleHeader">Authenticated Values</h2>
            <p>When logged in, this box will show your tokens and user info</p>
            {this.state.userInfo && <div style={{wordWrap: "break-word"}}>
            <span style={{fontWeight: "bold"}}>User Information:</span> <br />
            <span style={{fontWeight: "bold"}}>ID Token:</span> {this.state.userInfo.jwtIdToken} <br />
            <span style={{fontWeight: "bold"}}>Access Token:</span> {this.state.userInfo.jwtAccessToken} <br />
            <span style={{fontWeight: "bold"}}>Username:</span> {this.state.userInfo.user.name}</div>}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
