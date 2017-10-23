import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Configuration, TokensService } from '../shared/swagger';
import { UsersService } from './../shared/swagger/api/users.service';
import { Token } from './../shared/swagger/model/token';
import { User } from './../shared/swagger/model/user';
import { UserService } from './user.service';


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
  constructor(private usersService: UsersService, private userService: UserService,
    private tokensService: TokensService, private configuration: Configuration, private authService: AuthService) {
    userService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.updateTokens();
      }
    });
    this.configuration.apiKeys['Authorization'] = 'Bearer ' + this.authService.getToken();
    this.tokens$.subscribe(tokens => this.tokens = tokens);
  }

  setTokens(tokens: Token[]) {
    this.tokens$.next(tokens);
  }

  updateTokens() {
    this.usersService.getUserTokens(this.user.id).subscribe(token => this.setTokens(token));
  }

  registerToken(token: string, provider: string): Observable<Token> {
    switch (provider) {
      case 'quay.io':
        return this.tokensService.addQuayToken(token);
      case 'bitbucket.org':
        return this.tokensService.addBitbucketToken(token);
      case 'github.com':
        return this.tokensService.addGithubToken(token);
      case 'gitlab.com':
        return this.tokensService.addGitlabToken(token);
      default: {
        console.log('Unknown provider: ' + provider);
        return Observable.throw('Unknown provider.');
      }

    }
  }

  deleteToken(tokenId: number) {
    return this.tokensService.deleteToken(tokenId);
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
