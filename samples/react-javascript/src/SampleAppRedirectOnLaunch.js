import * as React from 'react';
import { AzureAD, LoginType, AuthenticationState } from 'react-aad-msal';

import { basicReduxStore } from './reduxStore';
import GetAccessTokenButton from './GetAccessTokenButton';
import GetIdTokenButton from './GetIdTokenButton';

// Import the authentication provider which holds the default settings
import { authProvider } from './authProvider';

class SampleAppRedirectOnLaunch extends React.Component {
  constructor(props) {
    super(props);

    // Change the login type to execute in a Redirect
    const options = authProvider.getProviderOptions();
    options.loginType = LoginType.Redirect;
    authProvider.setProviderOptions(options);

    this.interval = null;
    let redirectEnabled = sessionStorage.getItem('redirectEnabled') || false;
    this.state = {
      counter: 5,
      redirectEnabled: redirectEnabled,
    };
  }

  handleCheck = () => {
    this.setState(
      state => ({
        ...state,
        redirectEnabled: !state.redirectEnabled,
      }),
      () => {
        if (!this.state.redirectEnabled) {
          this.clearRedirectInterval();
        } else {
          sessionStorage.setItem('redirectEnabled', true);
        }
      },
    );
  };

  countdownToLogin = loginFunction => {
    if (this.state.redirectEnabled && !this.interval) {
      this.interval = setInterval(() => {
        if (this.state.counter > 0) {
          this.setState({ counter: this.state.counter - 1 });
        } else {
          this.clearRedirectInterval();
          this.setState({ redirectEnabled: false });
          loginFunction();
        }
      }, 1000);
    }
  };

  clearRedirectInterval() {
    clearInterval(this.interval);
    this.setState({ counter: 5 });
    sessionStorage.removeItem('redirectEnabled');
    this.interval = null;
  }

  render() {
    const { redirectEnabled } = this.state;

    return (
      <AzureAD provider={authProvider} reduxStore={basicReduxStore}>
        {({ login, logout, authenticationState }) => {
          const isInProgress = authenticationState === AuthenticationState.InProgress;
          const isAuthenticated = authenticationState === AuthenticationState.Authenticated;
          const isUnauthenticated = authenticationState === AuthenticationState.Unauthenticated;

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
            this.countdownToLogin(login);
            return (
              <div>
                <input type="checkbox" value={redirectEnabled} onChange={this.handleCheck} /> Enable redirect
                {redirectEnabled && <p>Redirecting in {this.state.counter} seconds...</p>}
              </div>
            );
          }
        }}
      </AzureAD>
    );
  }
}

export default SampleAppRedirectOnLaunch;
