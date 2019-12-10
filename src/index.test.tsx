import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { AzureAD, LoginType } from './index';
import { MsalAuthProvider } from './MsalAuthProvider';

let Enzyme;
let Adapter;
let authProvider: MsalAuthProvider;
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
