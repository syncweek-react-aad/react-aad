import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { AuthenticationState, AzureAD, IUserInfo, LoginType } from './index';

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

  wrapper.createUserInfo("accesstoken", "idtoken", testUser);

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

  let userInfo : IUserInfo = null;
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

  wrapper.createUserInfo("accesstoken", "idtoken", testUser);

  wrapper.resetUserInfo();

  expect(wrapper.state.authenticationState).toBe(AuthenticationState.Unauthenticated);
});