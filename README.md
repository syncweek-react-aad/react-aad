# React AAD MSAL

[![Build Status](https://reactaad.visualstudio.com/react-aad-msal/_apis/build/status/React%20AAD%20CI%20Master?branchName=master)](https://reactaad.visualstudio.com/react-aad-msal/_build/latest?definitionId=4&branchName=master)
[![NPM Version](https://badge.fury.io/js/react-aad-msal.svg)](https://badge.fury.io/js/react-aad-msal)
![Dependencies](https://img.shields.io/david/syncweek-react-aad/react-aad.svg)

React AAD MSAL is a library to easily integrate the Microsoft Authentication Library with Azure Active Directory in your React app quickly and reliably. The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

**Note: This is a sample developed to wrap around the MSAL library and make it easier to use. This library is NOT affiliated with the Identity team at Microsoft and was developed by the Commercial Software Engineering team as a tool for the Open Source community to use and contribute to as they see fit. Use at your own risk!**

## Features

React AAD MSAL is a library that allows you to easily integrate auth using Azure Active Directory into your React application. The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

The React AAD MSAL library provides the following features:

- Login using Azure Active Directory
  - create your own function that handles how login (using this AzureAD component) is triggered in your react app
  - create your own function that handles the login success. The AzureAD library will call this function when login is complete to pass back the user info.
- Logout callback
  - create your own function to handle how logout (using this AzureAD component) is triggered in your react app
- Optional use of redux store containing the token and user information returned from Active Directory

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

In the render module of your component, make sure to create an AzureAD component with the arguments you need. This uses the functions that you will define. Once the user is successfully authenticated, the component will render the JSX returned by the `authenticatedFunction`, which in this case is called `logoutCallback`. This is where you should put the secure, user-specific parts of your app. `loginCallback` and `printAccountInfo` can be any user defined functions.

Find the assignment for ClientID and replace the value with the Application ID for your application from the azure portal. The authority is the sign-in/signup policy for your application. Graph scopes is a list of scope URLs that you want to grant access to. You can find more information on the [active directory MSAL single page app azure sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

```jsx
// ...

return (
  const config = {
    auth: {
      authority: 'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>',
      clientId: '<Application ID for your application>',
      redirectUri: '<Optional redirect URI for your application'
    },
    cache: {
      cacheLocation: "localStorage",
      storeAuthStateInCookie: true
    }
  };

  const authenticationParameters = {
    scopes: [
      '<property (i.e. user.read)>',
      'https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/<scope (i.e. demo.read)>'
    ]
  }

  <AzureAD
    provider={
      new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Popup)
    }
    unauthenticatedFunction={this.loginCallback}
    authenticatedFunction={this.logoutCallback}
    accountInfoCallback={this.printAccountInfo}
  />
);
```

## Component Properties

| Property                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `provider`                | Factory object that provides the configuration values for your Azure Active Directory instance. See [Provider Options](#provider-options) in table below.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `authenticatedFunction`   | **[Optional]** A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components `logout function` which you can use to trigger a logout. The return value will be rendered by the AzureAD component. If no return value is provided, any elements wrapped by the AzureAD component will be rendered instead.                                                                                                                                                                                                              |
| `unauthenticatedFunction` | **[Optional]** A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components `login function` which you can then use to trigger a login. The return value will be rendered by the AzureAD component.                                                                                                                                                                                                                                                                                                                   |
| `accountInfoCallback`     | **[Optional]** A user defined callback function for the AzureAD component to consume. The AzureAD component will call this function when login is complete to pass back the user info in the following format: <br /><br /> `AccountInfo { jwtAccessToken: string, jwtIdToken: string, account: Msal.Account, authenticationResponse: Msal.AuthResponse }` <br /> <br /> The format of `Msal.Account` [can be found here](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/classes/_user_.user.html) |
| `reduxStore`              | **[Optional]** You can provide a redux store which the AzureAD component will dispatch `AAD_LOGIN_SUCCESS` and `AAD_LOGIN_SUCCESS` actions, as well as a `payload` containing `IAccountInfo`                                                                                                                                                                                                                                                                                                                                                                                  |
| `forceLogin`              | **[Optional]** A boolean that identifies whether the login process should be invoked immediately if the current user is unauthenticated. Defaults to `false`.                                                                                                                                                                                                                                                                                                                                                                                                                 |

### Provider Options

Each provider may have different configuration options. Depending on which provider you choose, you should use a different factory class.

As of right now, there is only a single provider, but more may be added in future versions.

#### MsalAuthProviderFactory

| Property     | Description                                                                                                                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`     | Instance of a `Msal.Configuration` object to configure the underlying provider.                                                                                                                                                                                                                               |
| `authParams` | Instance of the `Msal.AuthenticationParameters` configuration to identify how the authentication process should function. This object includes the `scopes` values. You can see possible [values for scopes here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes) |
| `type`       | **[Optional]** A `LoginType` value which identifies whether the login operation is executed using a Popup or Reidrect. The default value is Redirect.                                                                                                                                                         |

Below is the total set of configurable options that are supported currently in the `config` object.

```TypeScript
  // Protocol Support
  export type AuthOptions = {
    clientId: string;
    authority?: string;
    validateAuthority?: boolean;
    redirectUri?: string | (() => string);
    postLogoutRedirectUri?: string | (() => string);
    navigateToLoginRequestUrl?: boolean;
  };

  // Cache Support
  export type CacheOptions = {
    cacheLocation?: CacheLocation;
    storeAuthStateInCookie?: boolean;
  };

  // Library support
  export type SystemOptions = {
    logger?: Logger;
    loadFrameTimeout?: number;
    tokenRenewalOffsetSeconds?: number;
    navigateFrameWait?: number;
  };

  // Developer App Environment Support
  export type FrameworkOptions = {
    isAngular?: boolean;
    unprotectedResources?: Array<string>;
    protectedResourceMap?: Map<string, Array<string>>;
  };

  // Configuration Object
  export type Configuration = {
    auth: AuthOptions,
    cache?: CacheOptions,
    system?: SystemOptions,
    framework?: FrameworkOptions
  };
```

For more information on MSAL config options, please refer to the MSAL [configuration options](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications) documentation.

The set of configuration options that are supported for the `Msal.AuthenticationParameters` is below.

```TypeScript
  export type QPDict = {[key: string]: string};

  // Request type
  export type AuthenticationParameters = {
    scopes?: Array<string>;
    extraScopesToConsent?: Array<string>;
    prompt?: string;
    extraQueryParameters?: QPDict;
    claimsRequest?: string;
    authority?: string;
    state?: string;
    correlationId?: string;
    account?: Account;
    sid?: string;
    loginHint?: string;
  };
```

For more information on MSAL parameters, please see the MSAL [release notes](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/MSAL.js-1.0.0-api-release).

## Login

### Force login

The easiest way to initiate login is to rely on the `forceLogin` prop on the AzureAD component. If you do not provide a `authenticatedFunction` callback, any elements that are children on the AzureAD component will be rendered when the user is Authenticated successfully.

```jsx
<AzureAD
  provider={
    new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Popup)
  }
  forceLogin={true}>
  <p>Only authenticated users can see this.</p>
</AzureAd>
```

A common pattern to lock down an entire application with forced authentication is to use `forceLogin` and wrap your `<App>` component with the AzureAD component.

### Higher-Order Component

Sometimes it's easier to utilize a Higher-Order Component (HOC) to lock down an app with authentication. This can be accomplished with the `withAuthentication` component.

```Typescript
// ...
export default withAuthentication(App, {
 provider: new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Redirect),
 reduxStore: store
});
```

The first parameter is the component that requires authentication before being mounted. The second parameter is an object representing the props which will be passed to the `AzureAD` component internally. With this approach the `forceLogin` boolean will defualt to true, but can easily be overriden.

### Callback functions

To login, first create a callback function for the AzureAD component to consume. This function will be called when the component loads, and it will pass in the function to be called when the user wants to login. In this case, we create a button that will log the user in.

```jsx
import { AzureAD, LoginType } from 'AzureAD';

loginCallback = login => {
  return <button onclick={login}>Login</button>;
};

// ...
```

Once they're logged in, the AzureAD library will call another function given with an `IAccountInfo` instance. You can do whatever you want with this, but you should store it. In this example, we just print it out to console.

```javascript
printAccountInfo = accountInfo => {
  console.log(accountInfo);
};
```

Once you've set this up, you should be able to set up a button to login that will hit an AAD instance. To set up your instance, check out the documentation on [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad) and on how to connect an [Identity Provider](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app) for that AAD instance.

## Logout

Logging out is just as easy.

```jsx
logoutCallback = logout => {
  return (
    <div>
      You're logged in!
      <button onclick={logout}>Logout</button>
    </div>
  );
};
```

You can, of course, include a component in either of these functions. This allows you to gate which view of your application users get, based on whether or not they are authenticated.

## Integrating with a Redux Store

The Azure AD component optionally accepts a `reduxStore` prop. On successful login, Azure AD will dispatch an action of type `AAD_LOGIN_SUCCESS` to the provided store, containing the token and user information returned from Active Directory. It does the same for logout events, but the action will not contain a payload.

Import your store into the file rendering the AzureAD component and pass it in:

```jsx
<AzureAD
  reduxStore={store}
  provider={new MsalAuthProviderFactory(config, authenticationParameters, LoginType.Popup)}
  unauthenticatedFunction={this.loginCallback}
  authenticatedFunction={this.logoutCallback}
  accountInfoCallback={this.printAccountInfo}
/>
```

Add a case to handle `AAD_LOGIN_SUCCESS` and `AAD_LOGOUT_SUCCESS` actions in a reducer file:

```javascript
const initialState = {
  aadResponse: null,
};

const sampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'AAD_LOGIN_SUCCESS':
      return { ...state, aadResponse: action.payload };
    case 'AAD_LOGOUT_SUCCESS':
      return { ...state, aadResponse: null };
    default:
      return state;
  }
};
```

## Accessing the underlying MSAL `UserAgentApplication` object

While this wrapper attempts to provide a full-featured means of authenticating with Azure AD using the MSAL library, for advanced cases you may want to accesst the underlying `UserAgentApplication` object which is the entrypoint for all MSAL functionality. As an escape hatch, the auth provider returned with `MsalAuthProviderFactory` exposes the `UserAgentApplication` as a public member.

```jsx
const authProvider = new MsalAuthProviderFactory({...})
// authProvider.UserAgentApplication provides access to MSAL features

<AzureAD
  provider={authProvider}
  unauthenticatedFunction={this.loginCallback}
  authenticatedFunction={this.logoutCallback}
  accountInfoCallback={this.printAccountInfo}
/>
```

It is not recommended to use this method if it can be avoided, since operations executed via MSAL may not reflect in the wrapper.

## Demo

A sample React-based Single Page Application (SPA) that uses this component is available in the [sample folder](sample/README.md). There you'll find a couple implementations that leverage the library, as well as a tutorial of how to set up Azure Active Directory with an Identity Provider.

## Contributing

See our contribution guidelines [here](CONTRIBUTING.md)

## Resources

- [React AAD MSAL NPM Module](https://www.npmjs.com/package/react-aad-msal)
- [Get Started with Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad)
- [MSAL Documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/index.html)
- [AAD v2 Scopes](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes)
- [AAD B2C Setup MSA App](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app)

## Problems or Suggestions

[Please create an issue.](https://github.com/Azure-Samples/react-aad-msal/issues)
