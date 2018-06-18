import { Pipe, PipeTransform } from '@angular/core';

import { Token } from './../../../shared/swagger/model/token';

@Pipe({
  name: 'getTokenUsername'
})
export class GetTokenUsernamePipe implements PipeTransform {
  transform(source: string, tokens: Array<Token>): string {
    const tokenFound: Token = tokens.find(token => token.tokenSource === source);
    if (tokenFound) {
      return tokenFound.username;
    } else {
      return null;
    }
  }
}
