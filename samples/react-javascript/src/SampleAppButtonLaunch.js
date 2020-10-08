import * as React from "react";
import { AzureAD, LoginType, AuthenticationState } from "react-aad-msal";
import { basicReduxStore } from "./reduxStore";
import GetAccessTokenButton from "./GetAccessTokenButton";
import GetIdTokenButton from "./GetIdTokenButton";

// Import the authentication provider which holds the default settings
import { authProvider } from "./authProvider";

class SampleAppButtonLaunch extends React.Component {
  constructor(props) {
    super(props);

    // Change the login type to execute in a Popup
    const options = authProvider.getProviderOptions();
    options.loginType = LoginType.Popup;
    authProvider.setProviderOptions(options);
  }

  render() {
    return (
      <AzureAD provider={authProvider} reduxStore={basicReduxStore}>
        {({ login, logout, authenticationState }) => {
          const isInProgress = authenticationState === "InProgress";
          const isAuthenticated = authenticationState === "Authenticated";
          const isUnauthenticated = authenticationState === "Unauthenticated";

          if (isAuthenticated) {
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
          } else if (isUnauthenticated || isInProgress) {
            return (
              <button
                className="Button"
                onClick={login}
                disabled={isInProgress}
              >
                Login
              </button>
            );
          }
        }}
      </AzureAD>
    );
  }
}
export default SampleAppButtonLaunch;
