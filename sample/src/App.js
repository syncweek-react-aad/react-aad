import React, { Component } from 'react';
import './App.css';
import SampleAppButtonLaunch from './SampleAppButtonLaunch';
import SampleAppRedirectOnLaunch from './SampleAppRedirectOnLaunch';

class App extends Component {
  
  constructor(props) {
    super(props);
    
    this.state = {
      userInfo: null
    };
  }

  userInfoCallback = (userInfo) => {
    this.setState({userInfo});
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to react-aad-msal-samples</h1>
        </header>
        <div className="SampleContainer">
          {/* TODO: Only one sample is supported right now, 
                    Please uncomment to try the different methods. */}
                    
          <div className="SampleBox">
            <h2 className="SampleHeader">Button Login</h2>
            <p>This example will launch a popup dialog to allow for authentication
              with Azure Active Directory</p>
            <SampleAppButtonLaunch userInfoCallback={this.userInfoCallback} />
          </div>
          {/* <div className="SampleBox">
            <h2 className="SampleHeader">Automatic Redirect</h2>
            <p>This example shows how you can use the AzureAD component to redirect 
              the login screen automatically on page load. Click the checkbox below 
              to enable the redirect and refresh your browser window.
            </p>
            <SampleAppRedirectOnLaunch userInfoCallback={this.userInfoCallback} userInfo={this.state.userInfo}/>
          </div> */}
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
