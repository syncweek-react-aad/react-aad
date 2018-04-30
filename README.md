## React AAD MSAL

![build status](https://reactaad.visualstudio.com/_apis/public/build/definitions/1c71aebc-1683-48cd-9ab2-8663e6a4ec55/5/badge)

### Overview
React AAD MSAL is a library to easily integrate the Microsoft Authentication Library with Azure Active Directory in your React app quickly and reliably.  The library focuses on flexibility, allowing you to define how you want to interact with logins and logouts.
### Setup
In the render module of your component, make sure to create an AzureAD component with the arguments you need.  This uses the functions that you will define.  Once the user is successfully authenticated, the component will render the OnAuthenticationComponent given.  This is where you should put the secure, user-specific parts of your app.  `loginCallback` and `printUserInfo` can be any user defined functions.


Find the assignment for ClientID and replace the value with the Application ID for your application from the azure portal.  The authority is the sign-in/signup policy for your application.  Graph scopes is a list of scope URLs that you want to grant access to.  You can find more information on the [active directory MSAL single page app azure sample](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp).
```javascript
// ...

  return (
    <AzureAD
      clientID={'<Application ID for your application>'}
      graphScopes={['https://<your-tenant-name>.onmicrosoft.com/hello/demo.read']}
      unauthenticatedFunction={this.loginCallback}
      authenticatedFunction={this.logoutCallback}
      userInfoCallback={this.printUserInfo}
      authority={'https://login.microsoftonline.com/tfp/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>'}
      type={LoginType.Popup}>
      <OnAuthenticationComponent />
    </AzureAD>
);
```
### Login
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
//...
printUserInfo = (userInfo) => {console.log(userInfo)};
//...
```

Once you've set this up, you should be able to set up a button to login that will hit an AAD instance.  To set up your instance, check out the documentation on [Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory-b2c/) and on how to connect an [Identity Provider](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-setup-msa-app) for that AAD instance.

### Logout

Logging out is just as easy. 
```javascript
logoutCallback = (logout) => {
  return <button onclick={logout}>Logout</button>;
};
```
You can, of course, include a component in either of these functions.  This allows you to gate which view of your application users get, based on whether or not they are authenticated.

### Samples

If you want to run examples of this library out of the box, feel free to go to [the samples repo](https://reactaad.visualstudio.com/react-aad-msal/).  There you'll find a couple implementations that leverage the library, as well as a tutorial of how to set up Azure Active Directory with an Identity Provider.

### Integrating with a Redux Store

The Azure AD component optionally accepts a ```reduxStore``` prop. On successful login, Azure AD will dispatch an action of type ```AAD_LOGIN_SUCCESS``` to the provided store, containing the token and user information returned from Active Directory.  It does the same for logout events, but the action will not contain a payload.

Import your store into the file rendering the AzureAD component and pass it in:

```javascript
<AzureAD
  reduxStore={store}
  clientID={'<Application ID for your application>'}
  graphScopes={['https://<your-tenant-name>.onmicrosoft.com/hello/demo.read']}
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
