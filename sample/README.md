# React AAD MSAL Sample App

This repository contains a sample react application that demonstrates how to use the [`react-aad-msal`](https://www.npmjs.com/package/react-aad-msal) node module, an Azure Activity Directory react component.

## Getting Started

### Prerequisites

- [node.js](https://nodejs.org/en/)

- Azure Active Directory

  - [Documentation for AAD Application]( https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal)
  - [Documentation for AAD B2C Application](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-app-registration)

### Installation and Quickstart

1. `git clone https://github.com/Azure-Samples/react-aad-msal.git`
2. `cd react-aad-msal`
3. Create a `.env.local` file, with the following variables:
    ```
    REACT_APP_AAD_APP_CLIENT_ID=<client id guid>
    REACT_APP_AUTHORITY=<authority url (optional)>
    ```
4. Run the sample application `npm start`
   - Please note, this creates a symlink.  You may need to run `sudo npm start` on Mac/Linux.

The sample site should launch in a Web browser at `http://localhost:3000`.

## Sample Application Details

This sample demonstrates how to use the `Popup` and `Redirect` auth methods. As well as how to use the (optional) redux store.

To run this sample, you just need to provide your `REACT_APP_AAD_APP_CLIENT_ID` and (optionally) `REACT_APP_AUTHORITY`.

``` jsx
<AzureAD
  clientID={process.env.REACT_APP_AAD_APP_CLIENT_ID}
  authority={process.env.REACT_APP_AUTHORITY}
  // ...
 >
```

### SampleAppButtonLaunch.js - Popup Sample

Type is set to `LoginType.Popup`.

``` jsx
<AzureAD
  // ...
  type={LoginType.Popup}
  // ...
 >
```

And we also provide a reduxStore (setup in our `reduxStore.js` file).

``` jsx
import { basicReduxStore } from './reduxStore';

<AzureAD
  // ...
  reduxStore={basicReduxStore}
  // ...
>
```

For our `userInfoCallback` property, we setup a function that just saves the userInfo we get back from AAD to state.

``` javascript
userJustLoggedIn = receivedUserInfo => {
  this.setState({ userInfo: receivedUserInfo })
}
```

For our `unauthenticatedFunction` property, we setup a function that returns a button that uses the login function provided by our AzureAD component.

``` jsx
unauthenticatedFunction = loginFunction => {
    return (
        <button className="Button" onClick={loginFunction}>Login</button>
    );
}
```

For our `authenticatedFunction` property, we setup a function that returns a button that uses the logout function provided by our AzureAD component.

``` jsx
authenticatedFunction = (logout) => {
    return (<div>
        You're logged in!
        <br />
        <br />
        <button onClick={logout} className="Button">Logout</button>
        <br />
    </div>) ;
}
```

### SampleAppRedirectOnLaunch.js - Redirect Sample

Type is set to `LoginType.Redirect`.

``` jsx
<AzureAD
  // ...
  type={LoginType.Redirect}
  // ...
>
```

For our `userInfoCallback` property, we setup a function that just saved the userInfo we get back to state.

``` javascript
userJustLoggedIn = receivedUserInfo => {
  this.setState({ userInfo: receivedUserInfo })
}
```

For our `unauthenticatedFunction` property, we setup a function that returns a a div that lets the user know we are going to redirect them, and uses the login function provided by our AzureAD component to complete the login in a new window.

``` jsx
unauthenticatedFunction = loginFunction => {
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
  
  if (this.state.redirectEnabled) {
    return (<div>Redirecting in {this.state.counter} seconds...</div>);
  }
  
  return (<div />);
};
```

For our `authenticatedFunction` property, we setup a function that returns a button that uses the logout function provided by our AzureAD component.

``` jsx
authenticatedFunction = logout => {
  return (<div><button onClick={() => {
    logout();
  }} className="Button">Logout</button></div>);
}
```

## Resources

- [React AAD MSAL NPM Module](https://www.npmjs.com/package/react-aad-msal)
- [Getting Started with an Azure AD App](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal)
- [Getting Started with an Azure AD B2C App](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-app-registration)