# react-aad-msal Sample App

This repository contains a sample react application that demonstrates how to use the [`react-aad-msal`](https://www.npmjs.com/package/react-aad-msal) node module, an Azure Activity Directory react component.

## Features

React AAD MSAL is a library that allows you to easily integrate auth using Azure Active Directory into your React application.  The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

The React AAD MSAL library provides the following features:

* Login using Azure Active Directory
     - create your own function that handles how login (using this AzureAD component) is trigger in your react app
     - create your own function that handles the login success. The AzureAD library will call this function when login is complete to pass back the user info.
* Logout callback
    - create your own function to handle how logout (using this AzureAD component) is trigger in your react app
* Optional use of redux store containing the token and user information returned from Active Directory

## Getting Started
- Build the `react-aad-msal` component: `npm install && npm run build`
- create a `.env.local` file, with the following variables:
  ```
  REACT_APP_AAD_APP_CLIENT_ID=<client id guid>
  REACT_APP_AUTHORITY=<authority url (optional)>
  ```
- Run the sample application: `npm install && npm run start`

The sample site should launch in a Web browser.

### Prerequisites

*Setting up an Azure Active Directory App*

In order to use this sample, you must have an Azure Active Directory application setup.

Documentation for AAD Application:

https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal

Documentation for AAD B2C Application:

https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-app-registration

<<<<<<< HEAD
## Getting Started

*NOTE: in order to successfully build and run this sample, be sure to complete the prerequisite steps above.
An Azure Active Directory application must first be setup and configured.*

- Build the `react-aad-msal` component: `npm install && npm run build`
- create a `.env.local` file, with the following variables:
  ```
  REACT_APP_AAD_APP_CLIENT_ID=<client id guid>
  REACT_APP_AUTHORITY=<authority url (optional)>
  ```
- Run the sample application: `npm install && npm run start`

The sample site should launch in a Web browser.

=======
>>>>>>> Added sample app
### Quickstart

1. `git clone [repository clone url]`
2. `cd react-aad-msal`
3. `npm install`
4. Setup a `.env` file with the following items:
    - `REACT_APP_AAD_APP_CLIENT_ID`
    - `REACT_APP_AUTHORITY`
5. `npm start`

## Demo

This sample demonstrates how to use the `Popup` auth method. As well as how to use the (optional) redux store.

To run this sample, you just need to provide your `REACT_APP_AAD_APP_CLIENT_ID` and (optionally) `REACT_APP_AUTHORITY`.

``` javascript
<AzureAD
  clientID={process.env.REACT_APP_AAD_APP_CLIENT_ID}
  authority={process.env.REACT_APP_AUTHORITY}
  ...
 >
```

Type is set to `LoginType.Popup`.

``` javascript
<AzureAD
  ...
  type={LoginType.Popup}
  ...
 >
```

And we also provide a reduxStore (setup in our `reduxStore.js` file).

``` javascript
import { basicReduxStore } from './reduxStore';

<AzureAD
  ...
  reduxStore={basicReduxStore}
  ...
>
```

For our `userInfoCallback` property, we setup a function that just saves the userInfo we get back from AAD to state.

``` javascript
userJustLoggedIn = receivedUserInfo => {
  this.setState({ userInfo: receivedUserInfo })
}
```

For our `unauthenticatedFunction` property, we setup a function that returns a button that uses the login function provided by our AzureAD component.

``` javascript
unauthenticatedFunction = loginFunction => {
  return (
    <button style={buttonStyle} onClick={loginFunction}>Login</button>
  );
}
```

//TODO: Logout documentation

## Resources

- Link to react-aad-msal library github
- Link to react-aad-msal npm page
