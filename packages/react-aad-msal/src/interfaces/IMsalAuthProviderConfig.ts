import { LoginType } from 'src/enums';

export interface IMsalAuthProviderConfig {
  // Determines whether the login process is executed in a new popup window,
  // or by redirecting to the login page
  loginType: LoginType;
  // When a token is refreshed it will be done by loading a page in an iframe.
  // Rather than reloading the same page, we can point to an empty html file which will prevent
  // site resources from being loaded twice.
  tokenRefreshUri?: string;
}
