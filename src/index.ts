import { AzureAD } from './AzureAD';

export { AccessTokenResponse } from './AccessTokenResponse';
export { AuthenticationActions } from './actions';
export { AzureAD, IAzureADFunctionProps } from './AzureAD';
export { IdTokenResponse } from './IdTokenResponse';
export { AuthenticationState, IAccountInfo, IMsalAuthProviderConfig, LoginType } from './Interfaces';
export { MsalAuthProvider } from './MsalAuthProvider';
export { withAuthentication } from './withAuthentication';

export default AzureAD;
