import { Pipe, PipeTransform } from '@angular/core';

import { Token } from './../../../shared/swagger/model/token';

@Pipe({
  name: 'getTokenUsername'
})
export class GetTokenUsernamePipe implements PipeTransform {
  /**
   * Given the token source ('github.com') and the users current list of tokens,
   * get the token's username associated with that source.
   *
   * @param {string} source  The token source ('github.com', etc)
   * @param {Array<Token>} tokens  The user's current list of tokens
   * @returns {string}  The username extracted using that token in a 3rd party site
   * @memberof GetTokenUsernamePipe
   */
  transform(source: string, tokens: Array<Token>): string {
    const tokenFound: Token = tokens.find(token => token.tokenSource === source);
    if (tokenFound) {
      return tokenFound.username;
    } else {
      return null;
    }
  }
}
