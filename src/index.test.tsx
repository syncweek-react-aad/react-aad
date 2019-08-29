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

import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { IdToken } from 'msal/lib-commonjs/IdToken';
import { AuthenticationState, AzureAD, LoginType } from './index';
import { IAccountInfo } from './Interfaces';
import { MsalAuthProvider } from './MsalAuthProvider';

let Enzyme;
let Adapter;
let authProvider: MsalAuthProvider;
let loggedInUser: IAccountInfo;
let testAccount: Msal.Account;

beforeAll(() => {
  Enzyme = require('enzyme');
  Adapter = require('enzyme-adapter-react-16');

  Enzyme.configure({ adapter: new Adapter() });
});

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();

  authProvider = new MsalAuthProvider(
    {
      auth: {
        authority: null,
        clientId: '<guid>',
      },
      cache: {
        cacheLocation: 'sessionStorage' as Msal.CacheLocation,
      },
    },
    {
      scopes: ['openid'],
    },
    LoginType.Popup,
  );

  testAccount = {
    accountIdentifier: 'Something',
    environment: 'testEnv',
    homeAccountIdentifier: 'testIdentifier',
    idToken: {},
    idTokenClaims: {},
    name: 'Lilian',
    sid: 'sid',
    userName: 'LilUsername',
  };

  loggedInUser = {
    account: testAccount,
    jwtAccessToken: 'accesstoken',
    jwtIdToken: 'idtoken',
  };
});

it('renders without crashing', () => {
  const unauthenticatedFunction = (login: any) => {
    return (
      <div>
        <h1> unauthenticatedFunction </h1>
      </div>
    );
  };

  const authenticatedFunction = (logout: any) => {
    return (
      <div>
        <h1> authenticatedFunction </h1>
      </div>
    );
  };

  const accountInfoCallback = (token: any) => {
    // empty
  };

  const div = document.createElement('div');
  ReactDOM.render(
    <AzureAD
      provider={authProvider}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      accountInfoCallback={accountInfoCallback}
    />,
    div,
  );
  ReactDOM.unmountComponentAtNode(div);
});

it('updates the component state', () => {
  let accountInfo: IAccountInfo = null;

  const unauthenticatedFunction = jest.fn();
  const authenticatedFunction = jest.fn();
  const accountInfoCallback = jest.fn((token: any) => {
    accountInfo = token;
  });

  const wrapper = Enzyme.shallow(
    <AzureAD
      provider={authProvider}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      accountInfoCallback={accountInfoCallback}
    />,
  ).instance() as AzureAD;

  wrapper.onAccountInfoChanged(loggedInUser);
  wrapper.setAuthenticationState(AuthenticationState.Authenticated);

  expect(accountInfo).toEqual(loggedInUser);
  expect(wrapper.state.authenticationState).toBe(AuthenticationState.Authenticated);
  expect(accountInfoCallback).toHaveBeenCalledWith(loggedInUser);
});

it('logs out the user', () => {
  const unauthenticatedFunction = jest.fn();
  const authenticatedFunction = jest.fn();
  const accountInfoCallback = jest.fn((token: any) => {}); // tslint:disable-line: no-empty

  const wrapper = Enzyme.shallow(
    <AzureAD
      provider={authProvider}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      accountInfoCallback={accountInfoCallback}
    />,
  ).instance() as AzureAD;

  wrapper.setAuthenticationState(AuthenticationState.Unauthenticated);

  expect(wrapper.state.authenticationState).toBe(AuthenticationState.Unauthenticated);
  expect(accountInfoCallback).not.toHaveBeenCalled();
});
