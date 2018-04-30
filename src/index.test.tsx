import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { AzureAD, LoginType } from './index';

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

  const unauthenticatedFunction = (login: any) => {
    return <div><h1> unauthenticatedFunction </h1> </div>
  }

  const authenticatedFunction = (logout: any) => {
    return <div><h1> authenticatedFunction </h1> </div>
  }

  const userInfoCallback = (token: any) => {
    // Empty
  }

  const wrapper = Enzyme.shallow(
    <AzureAD
      clientID={'ed236c58-c43b-444c-962c-0bc28a81a753'}
      scopes={[' https://login.microsoftonline.com/syncteam14.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_All']}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      userInfoCallback={userInfoCallback}
      authority={'https://login.microsoftonline.com/syncteam14.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_All'}
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

  wrapper.createUserInfo("accesstoken", "idtoken", testUser);

  expect(wrapper.state.authenticated).toBe(true);
  expect(wrapper.state.userInfo ? wrapper.state.userInfo.jwtAccessToken : '').toEqual("accesstoken");
  expect(wrapper.state.userInfo ? wrapper.state.userInfo.jwtIdToken : '').toEqual("idtoken");
  expect(wrapper.state.userInfo ? wrapper.state.userInfo.user : {}).toEqual(testUser);

});

it('logs out the user', () => {

  const unauthenticatedFunction = (login: any) => {
    return <div><h1> unauthenticatedFunction </h1> </div>
  }

  const authenticatedFunction = (logout: any) => {
    return <div><h1> authenticatedFunction </h1> </div>
  }

  const userInfoCallback = (token: any) => {
    // Empty
  }

  const wrapper = Enzyme.shallow(
    <AzureAD
      clientID={'ed236c58-c43b-444c-962c-0bc28a81a753'}
      graphScopes={[' https://login.microsoftonline.com/syncteam14.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_All']}
      unauthenticatedFunction={unauthenticatedFunction}
      authenticatedFunction={authenticatedFunction}
      userInfoCallback={userInfoCallback}
      authority={'https://login.microsoftonline.com/syncteam14.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_All'}
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

  wrapper.createUserInfo("accesstoken", "idtoken", testUser);

  wrapper.resetUserInfo();

  expect(wrapper.state.authenticated).toBe(false);
  expect(wrapper.state.userInfo).toBeNull();
});