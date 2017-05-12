import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';

@Injectable()
export class TokenService {

  constructor(private httpService: HttpService) { }

  registerToken(token: string, provider: string) {
    let registerTokenUrl = `${ Dockstore.API_URI }/auth/tokens/${ provider }`;

    if (provider === 'quay.io') {
      registerTokenUrl += `?access_token=${ token }`;
    } else {
      registerTokenUrl += `?code=${ token }`;
    }

    return this.httpService.getAuthResponse(registerTokenUrl);
  }

  deleteToken(tokenId: number) {
    const deleteTokenUrl = `${ Dockstore.API_URI }/auth/tokens/${ tokenId }`;

    return this.httpService.deleteAuth(deleteTokenUrl);
  }

}
