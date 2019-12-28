export { IAccountInfo, IMsalAuthProviderConfig } from './interfaces';
export { AuthenticationActions, AuthenticationState, LoginType } from './enums';

export { AccessTokenResponse } from './AccessTokenResponse';
export { IdTokenResponse } from './IdTokenResponse';
export { MsalAuthProvider } from './MsalAuthProvider';

import { AzureAD } from './components/AzureAD';
export * from './components/AzureAD';
export { withAuthentication } from './components/withAuthentication';

export default AzureAD;
