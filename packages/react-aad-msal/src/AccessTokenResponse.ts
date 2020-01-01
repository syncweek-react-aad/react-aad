import { AuthResponse } from 'msal';

import { TokenType } from './enums';

export class AccessTokenResponse {
  public accessToken = '';
  public scopes: string[] = [];
  public expiresOn: Date;
  public state = '';

  constructor(response: AuthResponse) {
    if (response.tokenType !== TokenType.AccessToken) {
      throw new Error(
        `Can't construct an AccessTokenResponse from a AuthResponse that has a token type of "${response.tokenType}".`,
      );
    }

    this.accessToken = response.accessToken;
    this.expiresOn = response.expiresOn;
    this.scopes = response.scopes;
    this.state = response.accountState;
  }
}
