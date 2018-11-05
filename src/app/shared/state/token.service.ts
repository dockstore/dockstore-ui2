import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { map } from 'rxjs/operators';

import { TokensService, UsersService, User } from '../swagger';
import { Token } from '../swagger/model/token';
import { UserQuery } from '../user/user.query';
import { TokenStore } from './token.store';
import { Observable, throwError } from 'rxjs';
import { UserState } from '../user/user.store';
import { Provider } from '../enum/provider.enum';

@Injectable({ providedIn: 'root' })
export class TokenService {

  constructor(private tokenStore: TokenStore, private tokensService: TokensService, private usersService: UsersService,
    private http: HttpClient, private userQuery: UserQuery) {
  }

  @transaction()
  get(userId: number) {
    this.tokenStore.remove();
    if (userId) {
      this.usersService.getUserTokens(userId).subscribe((tokens: Array<Token>) => {
        this.tokenStore.add(tokens);
      });
    }
  }

  add(token: Token) {
    this.tokenStore.add(token);
  }

  update(id, token: Partial<Token>) {
    this.tokenStore.update(id, token);
  }

  remove(id: ID) {
    this.tokenStore.remove(id);
  }

  removeAll() {
    this.tokenStore.remove();
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
}
