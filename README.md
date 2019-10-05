<p align="center">
  <img src="https://user-images.githubusercontent.com/1908292/64083094-6321ce80-ccce-11e9-8c09-4101444bc4f8.png">
</p>
<p align="center">The easiest way to integrate the <a href="https://github.com/AzureAD/microsoft-authentication-library-for-js" target="_blank">Microsoft Authentication Library</a> (MSAL) with <a href="https://reactjs.org/" target="_blank">React</a> applications. Secure your apps with <a href="https://azure.microsoft.com/en-us/services/active-directory/" target="_blank">Azure Active Directory</a> (AAD)</p>
<p align="center">
<a href="https://www.npmjs.com/package/react-aad-msal"><img src="https://badge.fury.io/js/react-aad-msal.svg" alt="npm version" height="18"></a> <a href="https://reactaad.visualstudio.com/react-aad-msal/_build/latest?definitionId=4&branchName=master"><img src="https://reactaad.visualstudio.com/react-aad-msal/_apis/build/status/React%20AAD%20CI%20Master?branchName=master" alt="build status" height="18"></a> <a href="https://david-dm.org/syncweek-react-aad/react-aad-msal"><img src="https://img.shields.io/david/syncweek-react-aad/react-aad.svg" alt="dependencies" height="18"></a> <a href="https://npmcharts.com/compare/react-aad-msal?minimal=true" target="_blank"><img alt="npm" src="https://img.shields.io/npm/dm/react-aad-msal"></a>
</p>

<p align="center">:monkey_face: Our code monkeys live on a solid diet of :star:'s. If you like what they're doing, please feed them!</p>

# React AAD MSAL

A library of components to easily integrate the Microsoft Authentication Library with Azure Active Directory in your React app quickly and reliably. The library focuses on flexibility, providing functionality to login, logout, and fetch the user details while maintaining access to the underlying MSAL library for advanced use.

**:exclamation: This library is not affiliated with the Identity team at Microsoft. It was developed as a tool for the Open Source community to use and contribute to as they see fit.**

## :memo: Table of contents

- [React AAD MSAL](#react-aad-msal)
  - [:memo: Table of contents](#memo-table-of-contents)
  - [:tada: Features](#tada-features)
  - [:checkered_flag: Getting Started](#checkeredflag-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Creating the Provider](#creating-the-provider)
      - [Configuration Options](#configuration-options)
      - [Authentication Parameters](#authentication-parameters)
      - [Login Type](#login-type)
  - [:package: Authentication Components](#package-authentication-components)
    - [AzureAD Component](#azuread-component)
    - [Higher Order Component](#higher-order-component)
  - [:mortar_board: Advanced Topics](#mortarboard-advanced-topics)
    - [Getting Tokens for API Requests](#getting-tokens-for-api-requests)
      - [Refreshing Access Tokens](#refreshing-access-tokens)
      - [Renewing IdTokens](#renewing-idtokens)
    - [Integrating with a Redux Store](#integrating-with-a-redux-store)
    - [Accessing the MSAL API](#accessing-the-msal-api)
  - [:cd: Sample application](#cd-sample-application)
  - [:calendar: Roadmap](#calendar-roadmap)
  - [:books: Resources](#books-resources)
  - [:trophy: Contributers](#trophy-contributers)

## :tada: Features

:white_check_mark: Login/logout with `AzureAD` component  
:white_check_mark: Callback functions for login success, logout success, and user info changed  
:white_check_mark: `withAuthentication` higher order component for protecting components, routes, or the whole app  
:white_check_mark: Function as Child Component pattern ([FaCC](https://medium.com/merrickchristensen/function-as-child-components-5f3920a9ace9)) to pass authentication data and login/logout functions to children components  
:white_check_mark: Redux integration for storing authentication status, user info, tokens, etc  
:white_check_mark: Automatic renewal of IdTokens, and optional function to get a fresh token at any point  
:white_check_mark: Easily fetch a fresh Access Token from cache (or refresh it) before calling API endpoints

## :checkered_flag: Getting Started

### Prerequisites

- [node.js](https://nodejs.org/en/)
- [Register an app](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app) in AzureAD to get a `clientId`. You will need to [follow additional steps](https://docs.microsoft.com/en-us/azure/active-directory/develop/scenario-spa-app-registration) to enable the app for your SPA site.

### Installation

Via NPM:

```
npm install react-aad-msal
```

### Creating the Provider

Before beginning it is required to configure an instance of the `MsalAuthProvider` and give it three parameters:

| Parameters   | Description                                                                                                                                                                                                                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`     | Instance of a `Msal.Configuration` object to configure the underlying provider. The documentation for all the options can be found in the [configuration options](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options) doc         |
| `parameters` | Instance of the `Msal.AuthenticationParameters` configuration to identify how the authentication process should function. This object includes the `scopes` values. You can see possible [values for scopes here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes) |
| `loginType`  | **[Optional]** A `LoginType` value which identifies whether the login operation is executed using a Popup or Reidrect. The default value is Popup                                                                                                                                                             |

The `MsalAuthProvider` is meant to be a singleton. There are known implications when multiple instances of MSAL are running at the same time. The recommended approach is to instantiate the `MsalAuthProvider` in a separate file and `import` it when needed.

```TypeScript
// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';

const config = {
  auth: {
    authority: 'https://login.microsoftonline.com/common',
    clientId: '<YOUR APPLICATION ID>',
    redirectUri: '<OPTIONAL REDIRECT URI'
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

export const authProvider = new MsalAuthProvider(config, authenticationParameters, LoginType.Popup)
```

Now you can `import` the `authProvider` and use it in combination with one of the authentication components.

```tsx
// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { AzureAD } from 'react-aad-msal';

import App from './App';
import { authProvider } from './authProvider';

ReactDOM.render(
  <AzureAD provider={authProvider} forceLogin={true}>
    <App />
  </AzureAD>,
  document.getElementById('root'),
);
```

#### Configuration Options

The options that get passed to the `MsalAuthProvider` are defined by the MSAL library, and are described in more detail in the [configuration options](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications#configuration-options) documentation.

Below is the total set of configurable options that are supported currently in the `config`.

```TypeScript
  // Configuration Object
  export type Configuration = {
    auth: AuthOptions,
    cache?: CacheOptions,
    system?: SystemOptions
  };

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
```

For more information on MSAL config options refer to the MSAL [configuration options](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-js-initializing-client-applications) documentation.

#### Authentication Parameters

When instantiating an instance of the `MsalAuthProvider` the authentication parameters passed will become the default parameters used when authenticating and fetching or refreshing tokens. It is possible to change the default parameters later by executing the `setAuthenticationParameters()` method on the `MsalAuthProvider`.

The set of options that are supported for the `Msal.AuthenticationParameters` class can be found below as they are defined in the MSAL library.

```TypeScript
  export type AuthenticationParameters = {
    scopes?: Array<string>;
    extraScopesToConsent?: Array<string>;
    prompt?: string;
    extraQueryParameters?: {[key: string]: string};
    claimsRequest?: string;
    authority?: string;
    state?: string;
    correlationId?: string;
    account?: Account;
    sid?: string;
    loginHint?: string;
  };
```

#### Login Type

The `LoginType` parameter is an enum with two options for `Popup` or `Redirect` authentication. This parameter is optional and will default to `Popup` if not provided. At any time after instantiating the `MsalAuthProvider` the login type can be changed using the `setLoginType()` method.

## :package: Authentication Components

The library provides multiple components to integrate Azure AD authentication into your application and each component has various use cases. The are also plans for additional components, documented in the project [Roadmap](#calendar-roadmap).

### AzureAD Component

The `AzureAD` component is the primary method to add authentication to your application. When the component is loaded it internally uses MSAL to check the cache and determine the current authentication state. The users authentication status determines how the component will render the `children`.

1. If the `children` is an element, it will only be rendered when the `AzureAD` detects an authenticated user.
2. If the `children` is a function, then it will always be executed with the following argument: 
    ```tsx
    {
      login, // login function
      logout, // logout function
      authenticationState, // the current authentication state
      error, // any error that occured during the login process
      accountInfo, // account info of the authenticated user
    }
    ```
  
The `AzureAD` component will check that the IdToken is not expired before determining that the user is authenticated. If the token has expired, it will attempt to renew it silently. If a valid token is maintained it will be sure there is an active Access Token available, otherwise it will refresh silently. If either of the tokens cannot be refreshed without user interaction, the user will be prompted to signin again.

```tsx
import { AzureAD, AuthenticationState } from 'react-aad-msal';

// Import the provider created in a different file
import { authProvider } from './authProvider';

// Only authenticated users can see the span, unauthenticated users will see nothing
<AzureAD provider={authProvider}>
  <span>Only authenticated users can see me.</span>
</AzureAD>

// If the user is not authenticated, login will be initiated and they will see the span when done
<AzureAD provider={authProvider} forceLogin={true}>
  <span>Only authenticated users can see me.</span>
</AzureAD>

// Using a function inside the component will give you control of what to show for each state
<AzureAD provider={authProvider} forceLogin={true}>
  {
    ({login, logout, authenticationState, error, accountInfo}) => {
      if (authenticationState === AuthenticationState.Authenticated) {
        return (
          <p>
            <span>Welcome, {accountInfo.account.name}!</span>
            <button onClick={logout}>Logout</button>
          </p>
        );
      } else if (authenticationState === AuthenticationState.Unauthenticated) {
        if (error) {
          return (
              <p>
                <span>An error occured during authentication, please try again!</span>
                <button onClick={login}>Login</button>
              </p>
            );
        }

        return (
          <p>
            <span>Hey stranger, you look new!</span>
            <button onClick={login}>Login</button>
          </p>
        );
      }
    }
  }
</AzureAD>
```

The following props are available to the `AzureAD` component.

| AzureAD Props             | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `provider`                | An `MsalAuthProvider` instance containing configuration values for your Azure AD instance. See [Creating the Provider](#Creating the Provider) for details.                                                                                                                                                                                                                                                                                                  |
| `authenticatedFunction`   | :warning: **[Deprecated]** **[Optional]** A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components `logout function` which you can use to trigger a logout. The return value will be rendered by the AzureAD component. If no return value is provided, the `children` of the AzureAD component will be rendered instead.                                                                        |
| `unauthenticatedFunction` | :warning: **[Deprecated]** **[Optional]** A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components `login function` which you can then use to trigger a login. The return value will be rendered by the AzureAD component.                                                                                                                                                                       |
| `accountInfoCallback`     | :warning: **[Deprecated]** **[Optional]** A user defined callback function for the AzureAD component to consume. The AzureAD component will call this function when login is complete to pass back the user info as an instance of [`IAccountInfo`](/src/Interfaces.ts). In addition to the tokens, the account info includes the [`Msal.Account`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/Account.ts) |
| `reduxStore`              | **[Optional]** You can provide a redux store which the component will dispatch actions to when changes occur. You can find the list of all actions defined in the [AuthenticationActions](src/actions.ts) enum.                                                                                                                                                                                                                                              |
| `forceLogin`              | **[Optional]** A boolean that identifies whether the login process should be invoked immediately if the current user is unauthenticated. Defaults to `false`.                                                                                                                                                                                                                                                                                                |

### Higher Order Component

Sometimes it's easier to utilize a Higher Order Component (HoC) to lock down an app or page component with authentication. This can be accomplished using the `withAuthentication` component which acts as a wrapper for the `AzureAD` component.

```Typescript
import { withAuthentication } from 'react-aad-msal';

// The instance of MsalAuthProvider defined in a separate file
import { authProvider } from './authProvider.js';

// The App component wrapped in the withAuthentication() HoC
export default withAuthentication(App, {
 provider: authProvider,
 reduxStore: store
});
```

The first parameter is the component that requires authentication before being mounted. The second parameter is an object containing the props to be passed into the `AzureAD` component. With this approach the `forceLogin` prop will default to true. This is a good way to protect routes or quickly require authentication for your entire `App` in several lines.

## :mortar_board: Advanced Topics

### Getting Tokens for API Requests

The library components will manage authenticating the user without you needing to think about tokens. But there are scenarios where a fresh token will be needed to communicate with a service or to decode the token to examine the claims. The library exposes methods for retrieving active IdTokens and Access Tokens.

For more advanced scenarios where you need specific control over error handling when a token fails to renew you can always [access the MSAL API](#accessing-the-msal-api) methods and renew a token manually as described in the MSAL [token renewal pattern](https://github.com/AzureAD/microsoft-authentication-library-for-js/wiki/FAQs#q3-how-to-renew-tokens-with-msaljs) documentation.

#### Refreshing Access Tokens

To get a fresh and valid Access Token to pass to an API you can call the `getAccessToken()` on the `MsalAuthProvider` instance. This function will asynchronously attempt to retrieve the token from the cache. If the cached token has expired it will automatically attempt to refresh it. In some scenarios the token refresh will fail and the user will be required to authenticate again before a fresh token is provided. The method will handle these scenarios automatically.

The `getAccessToken()` returns an instance of the [`AccessTokenResponse`](/src/AccessTokenResponse.ts) class. The following snippet is an example of how you might use the function before calling an API endpoint.

```typescript
// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
export const authProvider = new MsalAuthProvider(
  {
    /* config */
  },
  {
    /* parameters */
  },
  LoginType.Popup,
);

// api.js
import { authProvider } from './authProvider';

const request = async url => {
  const token = await authProvider.getAccessToken();

  return fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + token.accessToken,
      'Content-Type': 'application/json',
    },
  });
};
```

#### Renewing IdTokens

To get a fresh and valid IdToken you can call the `getIdToken()` on the `MsalAuthProvider` instance. This function will asynchronously attempt to retrieve the token from the cache. If the cached token has expired it will automatically attempt to renew it. In some scenarios the token renewal will fail and the user will be required to authenticate again before a new token is provided. The method will handle these scenarios automatically.

The `getIdToken()` returns an instance of the [`IdTokenResponse`](/src/IdTokenResponse.ts) class. The following snippet is an example of how you might use the function to retrieve a valid IdToken.

```typescript
// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
export const authProvider = new MsalAuthProvider(
  {
    /* config */
  },
  {
    /* parameters */
  },
  LoginType.Popup,
);

// consumer.js
import { authProvider } from './authProvider';
const token = await authProvider.getIdToken();
const idToken = token.idToken.rawIdToken;
```

### Integrating with a Redux Store

The `AzureAD` component optionally accepts a `reduxStore` prop. On successful login and after an Access Token has been acquired, an action of type `AAD_LOGIN_SUCCESS` will be dispatch to the provided store containing the token and user information returned from Active Directory. It does the same for logout events, but the action will not contain a payload.

Import your store into the file rendering the `AzureAD` component and pass it as a prop:

```jsx
// authProvider.js
import { MsalAuthProvider, LoginType } from 'react-aad-msal';
export const authProvider = new MsalAuthProvider(
  {
    /* config */
  },
  {
    /* parameters */
  },
  LoginType.Popup,
);

// index.js
import { authProvider } from './authProvider';
import { store } from './reduxStore.js';

// ...

ReactDOM.render(
  <AzureAD provider={authProvider} reduxStore={store}>
    <App />
  </AzureAD>,
  document.getElementById('root'),
);
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

In addition to login and logout actions, the `MsalAuthProvider` will dispatch other actions for for various state changes. The full list can be found in the [actions.ts](/src/actions.ts) file and in the table below. An example of a fully implemented [sample reducer](/sample/src/reduxStore.js) can be found in the [sample project](/sample/).

| Action Type                       | Payload                                                                                                                              | Description                                                                                                                                                                                            |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AAD_INITIALIZING                  | None                                                                                                                                 | Dispatched when the `MsalAuthProvider` is instantiated and begins checking the cache to determine if the user is authenticated                                                                         |
| AAD_INITIALIZED                   | None                                                                                                                                 | Signifies that the `MsalAuthProvider` has successfully determined the authentication status of the user after being instantiated. It is safest not to use any state until initialization has completed |
| AAD_AUTHENTICATED_STATE_CHANGED   | [`AuthenticationState`](/src/Interfaces.ts)                                                                                          | Dispatched whenever the user's authentication status changes                                                                                                                                           |
| AAD_ACQUIRED_ID_TOKEN_SUCCESS     | [`IdTokenResponse`](/src/IdTokenResponse.ts)                                                                                         | Identifies that the IdToken has been retrieved or renewed successfully                                                                                                                                 |
| AAD_ACQUIRED_ID_TOKEN_ERROR       | [`Msal.AuthError`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/error/AuthError.ts) | Dispatched when an error occurred while attempting to retrieve or renew the IdToken                                                                                                                    |
| AAD_ACQUIRED_ACCESS_TOKEN_SUCCESS | [`AccessTokenResponse`](/src/AccessTokenResponse.ts)                                                                                 | Identifies that the Access Token has been retrieved or refreshed successfully                                                                                                                          |
| AAD_ACQUIRED_ACCESS_TOKEN_ERROR   | [`Msal.AuthError`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/error/AuthError.ts) | Dispatched when an error occurred while attempting to retrieve or refresh the Access Token                                                                                                             |
| AAD_LOGIN_SUCCESS                 | [`IAccountInfo`](/src/Interfaces.ts)                                                                                                 | Dispatched when the user has been authenticated and a valid Access Token has been acquired                                                                                                             |
| AAD_LOGIN_FAILED                  | None                                                                                                                                 | Dispatched when the authentication process fails                                                                                                                                                       |
| AAD_LOGIN_ERROR                   | [`Msal.AuthError`](https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-core/src/error/AuthError.ts) | Identifies that an error occurred while login was in process                                                                                                                                           |
| AAD_LOGOUT_SUCCESS                | None                                                                                                                                 | Dispatched when the user has successfully logged out on the client side                                                                                                                                |

### Accessing the MSAL API

While this wrapper attempts to provide a full-featured means of authenticating with AzureAD, for advanced cases you may want to access the underlying MSAL API. The `MsalAuthProvider` extends the MSAL `UserAgentApplication` class and will give you access to all the functions available, in addition to implementing new methods used by the library components.

```jsx
const authProvider = new MsalAuthProvider(config, authenticationParameters);
// authProvider provides access to MSAL features
```

It is not recommended to use this method if it can be avoided, since operations executed via MSAL may not reflect in the wrapper.

## :cd: Sample application

If you'd like to see a sample application running please see the [sample](sample/) application built with Create React App.

The project can be built with the following steps:

1. `git clone https://github.com/syncweek-react-aad/react-aad.git`
2. `cd ./react-aad`
3. Build the `react-aad` library:
   - `npm install`
   - `npm run build`
4. Run the sample project:
   - `npm start`

## :calendar: Roadmap

While the library is ready for use there is still plenty of ongoing work. The following is a list of a few of the improvements under consideration.

:white_medium_small_square: Rewrite the sample app to use hooks and simplify the logic.  
:white_medium_small_square: Add a `useAuthentication()` hook to the library.  
:white_medium_small_square: Replace the `AzureAD` render props with event handlers.  
:white_medium_small_square: Add Context API provider.  
:white_medium_small_square: Separate MSAL and Redux dependencies as `peerDependencies`  
:white_medium_small_square: Migrate to a build system such as Webpack, or Rollup.  
:white_medium_small_square: Add samples for consuming a Web API.  
:white_medium_small_square: Improve unit test coverage across the library.  
:white_medium_small_square: Maintain feature parity between the official MSAL [Angular library](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular) after it undergoes its planned upgrade.  

## :books: Resources

The following resources may be helpful and provide further insight. If you've written a blog post, tutorial, or article feel free to create an issue so we can include it.

- [Get Started with Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad)
- [MSAL Documentation](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/index.html)
- [AAD v2 Scopes](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes)
- [AAD B2C Setup MSA App](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app)

## :trophy: Contributers

This library is built with :heart: by members of the open source community. To become a contributer, please see the [contribution guidelines](CONTRIBUTING.md).

[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/0)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/0)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/1)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/1)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/2)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/2)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/3)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/3)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/4)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/4)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/5)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/5)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/6)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/6)[![](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/images/7)](https://sourcerer.io/fame/AndrewCraswell/syncweek-react-aad/react-aad/links/7)
