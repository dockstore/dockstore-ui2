
import {map} from 'rxjs/operators';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Provider } from '../shared/enum/provider.enum';
import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { BehaviorSubject ,  Observable } from 'rxjs';

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
  hasGitHubToken$ = this.tokens$.pipe(map(tokens => this.hasGitHubTokenFunction(tokens)));
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

  hasGitHubTokenFunction(tokens: Token[]) {
    if (!tokens) {
      return false;
    }
    const githubToken = tokens.find(token => token.tokenSource === 'github.com');
    if (githubToken) {
      return true;
    } else {
      return false;
    }
  }

  setTokens(tokens: Token[]) {
    this.tokens$.next(tokens);
  }

  updateTokens() {
    this.usersService.getUserTokens(this.user.id).subscribe(token => this.setTokens(token));
  }

  registerToken(token: string, provider: Provider): Observable<Token> {
    switch (provider) {
      case Provider.QUAY:
        return this.tokensService.addQuayToken(token);
      case Provider.BITBUCKET:
        return this.tokensService.addBitbucketToken(token);
      case Provider.GITHUB:
        return this.tokensService.addGithubToken(token);
      case Provider.GITLAB:
        return this.tokensService.addGitlabToken(token);
      default: {
        console.log('Unknown provider: ' + provider);
        return Observable.throwError('Unknown provider.');
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
          case TokenSource.GITHUB:
            tokenStatusSet.github = true;
            break;
          case TokenSource.BITBUCKET:
            tokenStatusSet.bitbucket = true;
            break;
          case TokenSource.QUAY:
            tokenStatusSet.quayio = true;
            break;
          case TokenSource.GITLAB:
            tokenStatusSet.gitlab = true;
            break;
        }
      }
      tokenSet = tokenStatusSet;
    }
    return tokenSet;
  }
}
