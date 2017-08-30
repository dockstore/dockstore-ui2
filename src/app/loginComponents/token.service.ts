import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from './../shared/swagger/model/user';
import { UserService } from './user.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { Token } from './../shared/swagger/model/token';
import { Injectable } from '@angular/core';

import { Dockstore } from '../shared/dockstore.model';
import { HttpService } from '../shared/http.service';


/**
 * This service contains the token array observable that is returned from usersService.getUserTokens().
 * No other component should be getting the tokens.  Every component should be getting the tokens from this service.
 * @export
 * @class TokenService
 */
@Injectable()
export class TokenService {
  tokens$: BehaviorSubject<Token[]> = new BehaviorSubject<Token[]>(null);
  tokens: Token[];
  user: User;
  constructor(private httpService: HttpService, private usersService: UsersService, private userService: UserService) {
    userService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.usersService.getUserTokens(user.id).subscribe(token => this.setTokens(token));
      }
    });
    this.tokens$.subscribe(tokens => this.tokens = tokens);
  }

  setTokens(tokens: Token[]) {
    this.tokens$.next(tokens);
  }

  registerToken(token: string, provider: string) {
    let registerTokenUrl = `${Dockstore.API_URI}/auth/tokens/${provider}`;

    if (provider === 'quay.io') {
      registerTokenUrl += `?access_token=${token}`;
    } else {
      registerTokenUrl += `?code=${token}`;
    }

    return this.httpService.getAuthResponse(registerTokenUrl);
  }

  deleteToken(tokenId: number) {
    const deleteTokenUrl = `${Dockstore.API_URI}/auth/tokens/${tokenId}`;

    return this.httpService.deleteAuth(deleteTokenUrl);
  }

  getUserTokenStatusSet(tokens: Token[]) {
    let tokenSet;
    const tokenStatusSet = {
      dockstore: false,
      github: false,
      bitbucket: false,
      quayio: false,
      gitlab: false
    };
    if (this.tokens) {
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
    }
    return tokenSet;
  }
}
