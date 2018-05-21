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

import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { AuthenticationState, AzureAD, LoginType } from './index';
import { IUserInfo } from './Interfaces';

Enzyme.configure({ adapter: new Adapter() })

beforeEach(() => {
  // values stored in tests will also be available in other tests unless you run
  localStorage.clear();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  //   ReactDOM.render(<AzureAD />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('updates the userInfo state', () => {

  let userInfo : IUserInfo = null;
  const unauthenticatedFunction = (login: any) => {
    return <div><h1> unauthenticatedFunction </h1> </div>
  }

  const authenticatedFunction = (logout: any) => {
    return <div><h1> authenticatedFunction </h1> </div>
  }

  const userInfoCallback = (token: any) => {
    userInfo = token;
  }

  const wrapper = Enzyme.shallow(
    <AzureAD
      clientID={'<random-guid>'}
      scopes={['openid']}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      userInfoCallback={userInfoCallback}
      authority={null}
      type={LoginType.Popup}
    />
  ).instance() as AzureAD;

  const testUser: Msal.User = {
    displayableId: "hi",
    idToken: {},
    identityProvider: "Facebook",
    name: "Lilian",
    userIdentifier: "Something"
  }

  const loggedInUser : IUserInfo = {
    jwtAccessToken: "accesstoken",
    jwtIdToken: "idtoken",
    user: testUser,
  }
  wrapper.updateState(loggedInUser);

  expect(userInfo).not.toBeNull();
  expect(userInfo.jwtAccessToken).toEqual("accesstoken");
  expect(userInfo.jwtIdToken).toEqual("idtoken");
  expect(userInfo.user).toEqual(testUser);

});

it('logs out the user', () => {

  const unauthenticatedFunction = (login: any) => {
    return <div><h1> unauthenticatedFunction </h1> </div>
  }

  const authenticatedFunction = (logout: any) => {
    return <div><h1> authenticatedFunction </h1> </div>
  }

  const userInfoCallback = (token: any) => {
    // empty
  }

  const wrapper = Enzyme.shallow(
    <AzureAD
      clientID={'<random-guid>'}
      scopes={['openid']}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      userInfoCallback={userInfoCallback}
      authority={null}
      type={LoginType.Popup}
    />
  ).instance() as AzureAD;

  const testUser: Msal.User = {
    displayableId: "hi",
    idToken: {},
    identityProvider: "Facebook",
    name: "Lilian",
    userIdentifier: "Something"
  }

  const loggedInUser : IUserInfo = {
    jwtAccessToken: "accesstoken",
    jwtIdToken: "idtoken",
    user: testUser,
  }

  wrapper.updateState(loggedInUser);

  wrapper.resetUserInfo();

  expect(wrapper.state.authenticationState).toBe(AuthenticationState.Unauthenticated);
});