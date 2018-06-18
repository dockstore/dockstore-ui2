import { Pipe, PipeTransform } from '@angular/core';

import { Token } from '../../../shared/swagger';

@Pipe({
  name: 'getTokenContent'
})
export class GetTokenContentPipe implements PipeTransform {
  transform(source: string, tokens: Array<Token>): string {
    const tokenFound: Token = tokens.find(token => token.tokenSource === source);
    if (tokenFound) {
      return tokenFound.content;
    } else {
      return null;
    }
  }
}
