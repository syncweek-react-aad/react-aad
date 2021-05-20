import * as React from "react";
import {
  AzureAD,
  LoginType,
  AuthenticationState,
  IAzureADFunctionProps
} from "react-aad-msal";

import { basicReduxStore } from "./reduxStore";
import GetAccessTokenButton from "./GetAccessTokenButton";
import GetIdTokenButton from "./GetIdTokenButton";

// Import the authentication provider which holds the default settings
import { authProvider } from "./authProvider";

const SampleAppRedirectOnLaunch = () => {
  const [counter, setCounter] = React.useState(5);
  const [redirectEnabled, setRedirectEnabled] = React.useState<boolean>(
    sessionStorage.getItem("redirectEnabled") === "true" || false
  );

  const [login, setLogin] = React.useState();

  const clearRedirectInterval = React.useCallback(interval => {
    clearInterval(interval);
    setCounter(5);
    sessionStorage.removeItem("redirectEnabled");
  }, []);

  React.useEffect(() => {
    let interval: any;
    if (redirectEnabled) {
      sessionStorage.setItem("redirectEnabled", "true");
      interval = setInterval(() => {
        if (counter > 0) {
          setCounter(c => c - 1);
        } else {
          clearRedirectInterval(interval);
          setRedirectEnabled(false);
          login();
        }
        clearInterval(interval);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
    };
  }, [counter, clearRedirectInterval, redirectEnabled, login]);

  // Change the login type to execute in a Redirect
  const options = authProvider.getProviderOptions();
  options.loginType = LoginType.Redirect;
  authProvider.setProviderOptions(options);

  const handleCheck = () => {
    setRedirectEnabled(r => !r);
    if (redirectEnabled) {
      sessionStorage.removeItem("redirectEnabled");
    } else {
      setCounter(5);
    }
  };

  const setLoginObject = (loginFunction: any) => {
    setLogin(() => loginFunction);
  };

  return (
    <AzureAD provider={authProvider} reduxStore={basicReduxStore}>
      {({ login, logout, authenticationState }: IAzureADFunctionProps) => {
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
          setLoginObject(login);
          return (
            <div>
              <input
                type="checkbox"
                checked={redirectEnabled}
                onChange={handleCheck}
              />{" "}
              Enable redirect : {redirectEnabled}
              {redirectEnabled && <p>Redirecting in {counter} seconds...</p>}
            </div>
          );
        }
      }}
    </AzureAD>
  );
};

export default SampleAppRedirectOnLaunch;
