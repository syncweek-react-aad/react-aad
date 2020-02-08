import { createStore, Reducer, compose } from "redux";
import { AuthenticationActions, AuthenticationState } from "react-aad-msal";

// add redux devtools extension as a property/method in window
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__?: typeof compose;
  }
}

const initialState = {
  initializing: false,
  initialized: false,
  idToken: null,
  accessToken: null,
  state: AuthenticationState.Unauthenticated
};

const rootReducer: Reducer<any, any> = (
  state = initialState,
  action: { type: any; payload: { account: any } }
) => {
  switch (action.type) {
    case AuthenticationActions.Initializing:
      return {
        ...state,
        initializing: true,
        initialized: false
      };
    case AuthenticationActions.Initialized:
      return {
        ...state,
        initializing: false,
        initialized: true
      };
    case AuthenticationActions.AcquiredIdTokenSuccess:
      return {
        ...state,
        idToken: action.payload
      };
    case AuthenticationActions.AcquiredAccessTokenSuccess:
      return {
        ...state,
        accessToken: action.payload
      };
    case AuthenticationActions.AcquiredAccessTokenError:
      return {
        ...state,
        accessToken: null
      };
    case AuthenticationActions.LoginSuccess:
      return {
        ...state,
        account: action.payload.account
      };
    case AuthenticationActions.LoginError:
    case AuthenticationActions.AcquiredIdTokenError:
    case AuthenticationActions.LogoutSuccess:
      return { ...state, idToken: null, accessToken: null, account: null };
    case AuthenticationActions.AuthenticatedStateChanged:
      return {
        ...state,
        state: action.payload
      };
    default:
      return state;
  }
};

export const basicReduxStore = createStore(
  rootReducer,
  // Enable the Redux DevTools extension if available
  /// See more: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfiblj
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
