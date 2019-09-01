//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
// MIT License:
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
//
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED ""AS IS"", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//

import { createStore } from 'redux';
import { AuthenticationActions, AuthenticationState } from 'react-aad-msal';

const initialState = {
  initializing: false,
  initialized: false,
  idToken: null,
  accessToken: null,
  state: AuthenticationState.Unauthenticated,
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case AuthenticationActions.Initializing:
      return {
        ...state,
        initializing: true,
        initialized: false,
      };
    case AuthenticationActions.Initialized:
      return {
        ...state,
        initializing: false,
        initialized: true,
      };
    case AuthenticationActions.AcquiredIdTokenSuccess:
      return {
        ...state,
        idToken: action.payload,
      };
    case AuthenticationActions.AcquiredAccessTokenSuccess:
      return {
        ...state,
        accessToken: action.payload,
      };
    case AuthenticationActions.AcquiredAccessTokenError:
      return {
        ...state,
        accessToken: null,
      };
    case AuthenticationActions.LoginError:
    case AuthenticationActions.AcquiredIdTokenError:
    case AuthenticationActions.LogoutSuccess:
      return { ...state, idToken: null, accessToken: null };
    case AuthenticationActions.AuthenticatedStateChanged:
      return {
        ...state,
        state: action.payload,
      };
    default:
      return state;
  }
};

export const basicReduxStore = createStore(
  rootReducer,
  // Enable the Redux DevTools extension if available
  /// See more: https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfiblj
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
