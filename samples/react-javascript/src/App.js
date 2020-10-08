import React, { Component } from "react";
import { AzureAD, AuthenticationState } from "react-aad-msal";
import { basicReduxStore } from "./reduxStore";

// Import the authentication provider which holds the default settings
import { authProvider } from "./authProvider";

import SampleAppButtonLaunch from "./SampleAppButtonLaunch";
import SampleAppRedirectOnLaunch from "./SampleAppRedirectOnLaunch";

import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      accountInfo: null,
      sampleType: null
    };

    const sampleType = localStorage.getItem("sampleType");
    if (sampleType) {
      this.state.sampleType = sampleType;
    }
  }

  handleClick = sampleType => {
    this.setState({ sampleType });
    localStorage.setItem("sampleType", sampleType);
  };

  render() {
    let sampleBox;

    switch (this.state.sampleType) {
      case "popup":
        sampleBox = (
          <div className="SampleBox">
            <h2 className="SampleHeader">Button Login</h2>
            <p>
              This example will launch a popup dialog to allow for
              authentication with Azure Active Directory
            </p>
            <SampleAppButtonLaunch />
          </div>
        );
        break;
      case "redirect":
        sampleBox = (
          <div className="SampleBox">
            <h2 className="SampleHeader">Automatic Redirect</h2>
            <p>
              This example shows how you can use the AzureAD component to
              redirect the login screen automatically on page load. Click the
              checkbox below to enable the redirect and refresh your browser
              window.
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
          {({ accountInfo, authenticationState, error }) => {
            return (
              <React.Fragment>
                {authenticationState === "Unauthenticated" && (
                  <div>
                    <button
                      onClick={() => this.handleClick("popup")}
                      className="Button"
                    >
                      Popup Sample
                    </button>{" "}
                    <button
                      onClick={() => this.handleClick("redirect")}
                      className="Button"
                    >
                      Redirect Sample
                    </button>
                  </div>
                )}

                <div className="SampleContainer">
                  {sampleBox}
                  <div className="SampleBox">
                    <h2 className="SampleHeader">Authenticated Values</h2>
                    <p>
                      When logged in, this box will show your tokens and user
                      info
                    </p>
                    {accountInfo && (
                      <div style={{ wordWrap: "break-word" }}>
                        <p>
                          <span style={{ fontWeight: "bold" }}>ID Token:</span>{" "}
                          {accountInfo.jwtIdToken}
                        </p>
                        <p>
                          <span style={{ fontWeight: "bold" }}>Username:</span>{" "}
                          {accountInfo.account.userName}
                        </p>
                        <p>
                          <span style={{ fontWeight: "bold" }}>
                            Access Token:
                          </span>{" "}
                          {accountInfo.jwtAccessToken}
                        </p>
                        <p>
                          <span style={{ fontWeight: "bold" }}>Name:</span>{" "}
                          {accountInfo.account.name}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="SampleBox">
                    <h2 className="SampleHeader">Errors</h2>
                    <p>
                      If authentication fails, this box will have the errors
                      that occurred
                    </p>
                    {error && (
                      <div style={{ wordWrap: "break-word" }}>
                        <p>
                          <span style={{ fontWeight: "bold" }}>errorCode:</span>{" "}
                          {error.errorCode}
                        </p>
                        <p>
                          <span style={{ fontWeight: "bold" }}>
                            errorMessage:
                          </span>{" "}
                          {error.errorMessage}
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
