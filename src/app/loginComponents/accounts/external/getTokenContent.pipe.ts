import { Pipe, PipeTransform } from '@angular/core';

import { Token } from '../../../shared/swagger';

@Pipe({
  name: 'getTokenContent',
})
export class GetTokenContentPipe implements PipeTransform {
  /**
   * Given the token source ('github.com') and the users current list of tokens,
   * get the token content associated with that source.
   *
   * @param {string} source  The token source ('github.com', etc)
   * @param {Array<Token>} tokens  The user's current list of tokens
   * @returns {string}  The actual access token to the 3rd party site (some random string of characters)
   * @memberof GetTokenContentPipe
   */
  transform(source: string, tokens: Array<Token>): string {
    const tokenFound: Token = tokens.find((token) => token.tokenSource === source);
    if (tokenFound) {
      return tokenFound.content;
    } else {
      return null;
    }
  }
}
