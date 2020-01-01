import { Account } from 'msal';

export interface IAccountInfo {
  jwtAccessToken: string;
  jwtIdToken: string;
  account: Account;
}
