import { AuthenticationState } from 'src/enums';
import { IAccountInfo } from './';

export interface IAuthProvider {
  onAuthenticationStateChanged?: (state: AuthenticationState, account?: IAccountInfo) => void;
  authenticationState: AuthenticationState;

  getAccountInfo(): IAccountInfo | null;
  login(): void;
  logout(): void;
}
