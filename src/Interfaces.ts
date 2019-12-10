import { Account } from 'msal';

export type AccountInfoCallback = (token: IAccountInfo) => void;

export enum LoginType {
  Popup,
  Redirect,
}

export enum AuthenticationState {
  Unauthenticated = 'Unauthenticated',
  InProgress = 'InProgress',
  Authenticated = 'Authenticated',
}

export interface IAccountInfo {
  jwtAccessToken: string;
  jwtIdToken: string;
  account: Account;
}

export enum TokenType {
  IdToken = 'id_token',
  AccessToken = 'access_token',
}

export interface IAuthProvider {
  onAuthenticationStateChanged?: (state: AuthenticationState, account?: IAccountInfo) => void;
  authenticationState: AuthenticationState;

  getAccountInfo(): IAccountInfo | null;
  login(): void;
  logout(): void;
}

export interface IMsalAuthProviderConfig {
  // Determines whether the login process is executed in a new popup window,
  // or by redirecting to the login page
  loginType: LoginType;
  // When a token is refreshed it will be done by loading a page in an iframe.
  // Rather than reloading the same page, we can point to an empty html file which will prevent
  // site resources from being loaded twice.
  tokenRefreshUri?: string;
}
