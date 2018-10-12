import { Injectable } from '@angular/core';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { Provider } from '../shared/enum/provider.enum';
import { TokenSource } from '../shared/enum/token-source.enum';
import { Configuration, TokensService } from '../shared/swagger';
import { UsersService } from '../shared/swagger/api/users.service';
import { Token } from '../shared/swagger/model/token';
import { User } from '../shared/swagger/model/user';
import { UserQuery } from '../shared/user/user.query';

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
  hasGitHubToken$ = this.tokens$.pipe(map(tokens => this.hasToken(tokens, 'github.com')));
  hasGoogleToken$ = this.tokens$.pipe(map(tokens => this.hasToken(tokens, 'google.com')));
  hasSourceControlToken$: Observable<boolean> = this.tokens$.pipe(map(tokens => this.hasSourceControlToken(tokens)));
  constructor(private usersService: UsersService, private userService: UserQuery,
    private tokensService: TokensService, private configuration: Configuration, private authService: AuthService) {
    userService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.updateTokens();
      }
    });
    this.hasSourceControlToken$ = this.tokens$.pipe(map(tokens => this.hasSourceControlToken(tokens)));
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? ('Bearer ' + token) : null;
    this.tokens$.subscribe(tokens => this.tokens = tokens);
  }

  hasSourceControlToken(tokens: Token[]): boolean {
    return this.hasToken(tokens, 'github.com') || this.hasToken(tokens, 'bitbucket.org') || this.hasToken(tokens, 'gitlab.com');
  }

  hasToken(tokens: Token[], tokenToFind: string): boolean {
    if (!tokens) {
      return false;
    }
    const foundToken = tokens.find(token => token.tokenSource === tokenToFind);
    if (foundToken) {
      return true;
    } else {
      return false;
    }
  }

  setTokens(tokens: Token[]) {
    this.tokens$.next(tokens);
  }

  private updateTokens() {
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
        return throwError('Unknown provider.');
      }

    }
  }

  deleteToken(tokenId: number) {
    return this.tokensService.deleteToken(tokenId);
  }

  getUserTokenStatusSet(tokens: Token[]) {
    const tokenStatusSet = {
      dockstore: false,
      github: false,
      bitbucket: false,
      quayio: false,
      gitlab: false
    };
    if (tokens) {
      tokens.forEach(token => {
        switch (token.tokenSource) {
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
      });
    }
    return tokenStatusSet;
  }
}
