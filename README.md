# React AAD MSAL

[![Build Status](https://reactaad.visualstudio.com/react-aad-msal/_apis/build/status/React%20AAD%20CI%20Master?branchName=master)](https://reactaad.visualstudio.com/react-aad-msal/_build/latest?definitionId=4&branchName=master)

React AAD MSAL is a library to easily integrate the Microsoft Authentication Library with Azure Active Directory in your React app quickly and reliably.  The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

**Note: This is a sample developed to wrap around the MSAL library and make it easier to use. This library is NOT affiliated with the Identity team at Microsoft and was developed by the Commercial Software Engineering team as a tool for the Open Source community to use and contribute to as they see fit. Use at your own risk!**

## Features

React AAD MSAL is a library that allows you to easily integrate auth using Azure Active Directory into your React application.  The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

The React AAD MSAL library provides the following features:

* Login using Azure Active Directory
     - create your own function that handles how login (using this AzureAD component) is triggered in your react app
     - create your own function that handles the login success. The AzureAD library will call this function when login is complete to pass back the user info.
* Logout callback
    - create your own function to handle how logout (using this AzureAD component) is triggered in your react app
* Optional use of redux store containing the token and user information returned from Active Directory

## Getting Started

### Prerequisites

- [node.js](https://nodejs.org/en/)

### Installation

- `npm install react-aad-msal`

### Quickstart

If you'd like a sample application running, please see the [sample readme](sample/README.md).

To build this component, follow these steps:

1. `git clone https://github.com/syncweek-react-aad/react-aad.git`
2. `cd ./react-aad`
3. Build the `react-aad` component:
    - `npm install`
    - `npm run build`

## Setup
In the render module of your component, make sure to create an AzureAD component with the arguments you need.  This uses the functions that you will define.  Once the user is successfully authenticated, the component will render the JSX returned by the `authenticatedFunction`, which in this case is called `logoutCallback`.  This is where you should put the secure, user-specific parts of your app.  `loginCallback` and `printUserInfo` can be any user defined functions.

Find the assignment for ClientID and replace the value with the Application ID for your application from the azure portal.  The authority is the sign-in/signup policy for your application.  Graph scopes is a list of scope URLs that you want to grant access to.  You can find more information on the [active directory MSAL single page app azure sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

``` jsx
  // ...

  return (
    <AzureAD
      provider={new MsalAuthProviderFactory({
        clientID: '<Application ID for your application>',
        scopes: ['<property (i.e. user.read)>', 'https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/<scope (i.e. demo.read)>'],
        authority: 'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>',
        redirectUri: '<Optional redirect URI for your application>',
        type: LoginType.Popup,
        persistLoginPastSession: true
      })}
      unauthenticatedFunction={this.loginCallback}
      authenticatedFunction={this.logoutCallback}
      userInfoCallback={this.printUserInfo} />
);
```

## Component Properties

| Property | Description |
| --- | --- |
| `provider` | Factory object that provides the configuration values for your Azure Active Directory instance. See [Provider Options](#provider-options) in table below |
| `authenticatedFunction` | A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components `logout function` which you can use to trigger a logout |
| `unauthenticatedFunction` | A user defined callback function for the AzureAD component to consume.  This function receives the AzureAD components `login function` which you can then use to trigger a login |
| `userInfoCallback` | A user defined callback function for the AzureAD component to consume. The AzureAD component will call this function when login is complete to pass back the user info in the following format:  <br /><br /> ``` UserInfo { jwtAccessToken: string, jwtIdToken: string, user: Msal.User }```  <br /> <br /> The format of `Msal.User` [can be found here](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/classes/_user_.user.html) |
| `reduxStore` | **[Optional]** You can provide a redux store which the AzureAD component will dispatch `AAD_LOGIN_SUCCESS` and `AAD_LOGIN_SUCCESS` actions, as well as a `payload` containing `IUserInfo` |

### Provider Options

Each provider may have different configuration options. Depending on which provider you choose, you should use a different factory class.

As of right now, there is only a single provider, but more may be added in future versions.

#### MsalAuthProviderFactory

| Property | Description |
| --- | --- |
| `clientID` | String representing your Azure Active Directory Application ID |
| `scopes` | Array of permission scopes you want to request from the application you are authenticating against. You can see possible [values for this property here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes) |
| `authority` | **[Optional]** A string representing your Azure Active Directory application policy. Include if you are trying to authenticate against your Azure Active Directory application. If you're using a B2C AAD, it is usually in the format of: <br/> <br/> `https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>` |
| `redirectUri` | **[Optional]** String or function returning a string which represents the URI to redirect back to when authentication completes |
| `type` | **[Optional]** `LoginType.Popup` or `LoginType.Redirect`. Redirect is the default if this value is not provided. Make sure to import `LoginType` from the react-aad-msal npm module if using this property  |
|`persistLoginPastSession`|**[Optional]** A boolean value representing if you want your user to be authenticated after the session ends. If `true` login information will be cached in `LocalStorage`. If `false` login information will be cached in `SessionStorage`. Defaults to `false`.|
|`validateAuthority` | **[Optional]** A boolean value to determine if the authority is validated against a known list of authorities. Defaults to `true`.|
|`postLogoutRedirectUri` | **[Optional]** String to identify where the user is redirected after logout. Default is `redirectUri`.|
|`loadFrameTimeout` | **[Optional]** The number of milliseconds of inactivity before a token renewal response from AAD should be considered timed out. Default is `6000ms`.|
|`navigateToLoginRequestUrl` | **[Optional]** Booolean to turn off default navigation to start page after login. Default is `true`.|
|`state` | **[Optional]** A value included in the request that will also be returned in the token response typically used for preventing cross-site request forgery attacks. By default, MSAL passes a randomly generated unique value for this purpose. The passed in state appended to the unique guid set by MSAL.js would come back in the `tokenReceivedCallback`.|
|`isAngular` | **[Optional]** Boolean representing whether the client application uses the Angular framework. MSAL will broadcast events in an Angular-friendly way. This is an undocumented parameter, for information, please refer to [the issue](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues/326) in the MSAL.js GitHub. Defaults to `false`.|
|`unprotectedResources` | **[Optional]** Array of URI's which are unprotected resources. MSAL will not attach a token to outgoing requests that have these URI. Defaults to `null`.|
|`protectedResourceMap` | **[Optional]** This is mapping of resources to scopes used by MSAL for automatically attaching access tokens in web API calls. A single access token is obtained for the resource. So you can map a specific resource path as follows: {"https://graph.microsoft.com/v1.0/me", ["user.read"]}. Defaults to `null`.|
|`storeAuthStateInCookie` | **[Optional]** This flag was introduced in MSAL v0.2.2 as a fix for authentication loop issues on IE and Edge. Enable the flag `storeAuthStateInCookie` to `true` to take advantage of this fix. When this is enabled, MSAL will store the auth request state required for validation of the auth flows in the browser cookies. Defaults to `false`|
|`logger` | **[Optional]** A custom implementation of the Msal.Logger class. Defaults to ``.|.

For more information on MSAL options, please refer to the [configuration options](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL-basics#configuration-options) documentation in the MSAL wiki.

## Login
To login, first create a callback function for the AzureAD component to consume.  This function will be called when the component loads, and it will pass in the function to be called when the user wants to login.  In this case, we create a button that will log the user in.

``` jsx
import { AzureAD, LoginType } from 'AzureAD'

loginCallback = (login) => {
  return <button onclick={login}>Login</button>;
};

// ...
```

Once they're logged in, the AzureAD library will call another function given with an `IUserInfo` instance.  You can do whatever you want with this, but you should store it.  In this example, we just print it out to console.

``` javascript
printUserInfo = (userInfo) => {
  console.log(userInfo)
};
```

Once you've set this up, you should be able to set up a button to login that will hit an AAD instance.  To set up your instance, check out the documentation on [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad) and on how to connect an [Identity Provider](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app) for that AAD instance.

## Logout

Logging out is just as easy.

``` jsx
logoutCallback = (logout) => {
  return (
    <div>
      You're logged in!
      <button onclick={logout}>Logout</button>
    </div>
  );
};
```

You can, of course, include a component in either of these functions.  This allows you to gate which view of your application users get, based on whether or not they are authenticated.

## Integrating with a Redux Store

The Azure AD component optionally accepts a ```reduxStore``` prop. On successful login, Azure AD will dispatch an action of type ```AAD_LOGIN_SUCCESS``` to the provided store, containing the token and user information returned from Active Directory. It does the same for logout events, but the action will not contain a payload.

Import your store into the file rendering the AzureAD component and pass it in:

``` jsx
<AzureAD
  reduxStore={store}
  provider={new MsalAuthProviderFactory({
    clientID: '<Application ID for your application>',
    scopes: ['<property (i.e. user.read)>', 'https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/<scope (i.e. demo.read)>'],
    authority: 'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>',
    type: LoginType.Popup,
    persistLoginPastSession: true
  })}
  unauthenticatedFunction={this.loginCallback}
  authenticatedFunction={this.logoutCallback}
  userInfoCallback={this.printUserInfo}
/>
```

Add a case to handle ```AAD_LOGIN_SUCCESS``` and ```AAD_LOGOUT_SUCCESS``` actions in a reducer file:

``` javascript
const initialState = {
  aadResponse: null,
};

const sampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AAD_LOGIN_SUCCESS':
      return { ...state, aadResponse: action.payload };
    case 'AAD_LOGOUT_SUCCESS':
      return { ...state, aadResponse: null};
    default:
      return state;
  }
};
```

## Demo

A sample React-based Single Page Application (SPA) that uses this component is available in the [sample folder](sample/README.md). There you'll find a couple implementations that leverage the library, as well as a tutorial of how to set up Azure Active Directory with an Identity Provider.

## Contributing

See our contribution guidelines [here](CONTRIBUTING.md)

## Resources

- [React AAD MSAL NPM Module](https://www.npmjs.com/package/react-aad-msal)
- [Get Started with Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad)
- [MSAL Documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/index.html)
- [AAD v2 Scopes](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes)
- [AAD B22 Setup MSA App](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app)

## Problems or Suggestions

[Please create an issue.](https://github.com/Azure-Samples/react-aad-msal/issues)
