import * as Msal from 'msal';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('jest-localstorage-mock'); // tslint:disable-line

import { AzureAD, LoginType } from './index';
import { MsalAuthProvider } from './MsalAuthProvider';

let Enzyme;
let Adapter;
let authProvider: MsalAuthProvider;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        authority: '<authority>',
        clientId: '<guid>',
      },
      cache: {
        cacheLocation: 'sessionStorage' as Msal.CacheLocation,
      },
    },
    {
      scopes: ['openid'],
    },
    {
      loginType: LoginType.Popup,
    },
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
  const unauthenticatedFunction = () => {
    return (
      <div>
        <h1> unauthenticatedFunction </h1>
      </div>
    );
  };

  const authenticatedFunction = () => {
    return (
      <div>
        <h1> authenticatedFunction </h1>
      </div>
    );
  };

  const accountInfoCallback = () => {
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
