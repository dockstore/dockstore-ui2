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

  getWebServiceVersion() {
    const url = `${ Dockstore.API_URI }/api/ga4gh/v1/metadata`;
    return this.httpService.getResponse(url);
  }

  getUserTokens(userId) {
    const url = `${ Dockstore.API_URI }/users/${userId}/tokens`;
    return this.httpService.getAuthResponse(url);
  }

  getUserTokenStatusSet(userId) {
    let tokenSet;
    this.getUserTokens(userId).subscribe(
      tokens => {
        const tokenStatusSet = {
          dockstore: false,
          github: false,
          bitbucket: false,
          quayio: false,
          gitlab: false
        };
        for (let i = 0; i < tokens.length; i++) {
          switch (tokens[i].tokenSource) {
            case 'dockstore':
              tokenStatusSet.dockstore = true;
              break;
            case 'github.com':
              tokenStatusSet.github = true;
              break;
            case 'bitbucket.org':
              tokenStatusSet.bitbucket = true;
              break;
            case 'quay.io':
              tokenStatusSet.quayio = true;
              break;
            case 'gitlab.com':
              tokenStatusSet.gitlab = true;
              break;
          }
        }
        tokenSet = tokenStatusSet;
      });
      return tokenSet;
  }

}
