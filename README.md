# React AAD MSAL

![build status](https://reactaad.visualstudio.com/_apis/public/build/definitions/1c71aebc-1683-48cd-9ab2-8663e6a4ec55/5/badge)

## Overview
React AAD MSAL is a library to easily integrate the Microsoft Authentication Library with Azure Active Directory in your React app quickly and reliably.  The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.

## Setup
In the render module of your component, make sure to create an AzureAD component with the arguments you need.  This uses the functions that you will define.  Once the user is successfully authenticated, the component will render the JSX returned by the `authenticatedFunction`, which in this case is called `logoutCallback`.  This is where you should put the secure, user-specific parts of your app.  `loginCallback` and `printUserInfo` can be any user defined functions.

Find the assignment for ClientID and replace the value with the Application ID for your application from the azure portal.  The authority is the sign-in/signup policy for your application.  Graph scopes is a list of scope URLs that you want to grant access to.  You can find more information on the [active directory MSAL single page app azure sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).

```javascript
  // ...

  return (
    <AzureAD
      clientID={'<Application ID for your application>'}
      scopes={['https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/<scope (i.e. demo.read)>']}
      unauthenticatedFunction={this.loginCallback}
      authenticatedFunction={this.logoutCallback}
      userInfoCallback={this.printUserInfo}
      authority={'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>'}
      type={LoginType.Popup}>
    </AzureAD>
);
```

## Component Properties

### Required

- `clientID`: String representing your Azure Active Directory Application ID

- `scopes`: Array of permission scopes you want to request from the application you are authenticating against. You can see possible [values for this property here](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-v2-scopes)

- `authenticatedFunction`: A user defined callback function for the AzureAD component to consume. This function receives the AzureAD components logout function, and returns JSX containing the logged in portion of your app. You can use this received logout callback to attach it to any part of your logged in portion of your application.

- `unauthenticatedFunction`: A user defined callback function for the AzureAD component to consume.  This function receives the AzureAD components login function which you can then use to trigger a login as you like

- `userInfoCallback`: A user defined callback function. The AzureAD library will calls this function when login is complete to pass back the user info in the following format:

    ``` javascript
    IUserInfo {
      jwtAccessToken: string,
      jwtIdToken: string,
      user: Msal.User
    }
    ```

    The format of [`Msal.User` can be found here](https://htmlpreview.github.io/?https://raw.githubusercontent.com/AzureAD/microsoft-authentication-library-for-js/dev/docs/classes/_user_.user.html)

- Child Component: You should provide a child component to the AzureAD component, this will be rendered when login is successful

### Optional

- `authority`: A string representing your Azure Active Directory application policy. Include if you are trying to authenticate against your Azure Active Directory application. If you're using a B2C AAD, it is usually in the format of: `https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`

- `type`: `LoginType.Popup`. Popup is currently the only type available; redirect is currently buggy and disabled.

- `reduxStore`: If you want to use redux for auth, you can provide a redux store which the AzureAD component will dispatch a `AAD_LOGIN_SUCCESS` action, as well as a `payload` containing `IUserInfo`

## Login
To login, first create a callback function for the AzureAD component to consume.  This function will be called when the component loads, and it will pass in the function to be called when the user wants to login.  In this case, we create a button that will log the user in.

```javascript
import AzureAD from 'AzureAD'

loginCallback = (login) => {
  return <button onclick={login}>Login</button>;
};

// ...
```

Once they're logged in, the AzureAD library will call another function given with an `IUserInfo` instance.  You can do whatever you want with this, but you should store it.  In this example, we just print it out to console.

```javascript
// ...

printUserInfo = (userInfo) => {
  console.log(userInfo)
};

// ...
```

Once you've set this up, you should be able to set up a button to login that will hit an AAD instance.  To set up your instance, check out the documentation on [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/get-started-azure-ad) and on how to connect an [Identity Provider](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app) for that AAD instance.

## Logout

Logging out is just as easy.

```javascript
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

## Samples

If you want to run examples of this library out of the box, feel free to go to [the samples repo](https://reactaad.visualstudio.com/react-aad-msal/).  There you'll find a couple implementations that leverage the library, as well as a tutorial of how to set up Azure Active Directory with an Identity Provider.

## Integrating with a Redux Store

The Azure AD component optionally accepts a ```reduxStore``` prop. On successful login, Azure AD will dispatch an action of type ```AAD_LOGIN_SUCCESS``` to the provided store, containing the token and user information returned from Active Directory. It does the same for logout events, but the action will not contain a payload.

Import your store into the file rendering the AzureAD component and pass it in:

```javascript
<AzureAD
  reduxStore={store}
  clientID={'<Application ID for your application>'}
  scopes={['https://<your-tenant-name>.onmicrosoft.com/<your-application-name>/demo.read']}
  unauthenticatedFunction={this.loginCallback}
  authenticatedFunction={this.logoutCallback}
  userInfoCallback={this.printUserInfo}
  authority={'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>'}
  type={LoginType.Popup}
/>
```

Add a case to handle ```AAD_LOGIN_SUCCESS``` and ```AAD_LOGOUT_SUCCESS``` actions in a reducer file:

```javascript
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