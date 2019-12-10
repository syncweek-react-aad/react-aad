import { AuthResponse } from 'msal';
import { IdToken } from 'msal/lib-commonjs/IdToken';
import { TokenType } from './Interfaces';

export class IdTokenResponse {
  public idToken: IdToken;
  public state = '';

  constructor(response: AuthResponse) {
    if (response.tokenType !== TokenType.IdToken) {
      throw new Error(
        `Can't construct an IdTokenResponse from a AuthResponse that has a token type of "${response.tokenType}".`,
      );
    }

    this.idToken = response.idToken;
    this.state = response.accountState;
  }
}
