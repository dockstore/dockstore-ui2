import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Token } from '../../shared/swagger/model/token';
import { TokenSource } from '../enum/token-source.enum';
import { TokenState, TokenStore } from './token.store';

@Injectable({
  providedIn: 'root',
})
export class TokenQuery extends QueryEntity<TokenState, Token> {
  tokens$: Observable<Array<Token>> = this.selectAll();
  hasGitHubToken$: Observable<boolean> = this.tokens$.pipe(map((tokens) => this.hasEntity(TokenSource.GITHUB)));
  hasGoogleToken$: Observable<boolean> = this.tokens$.pipe(map((tokens) => this.hasEntity(TokenSource.GOOGLE)));
  hasZenodoToken$: Observable<boolean> = this.tokens$.pipe(map((tokens) => this.hasEntity(TokenSource.ZENODO)));
  gitHubToken$: Observable<string> = this.selectEntity('github.com').pipe(map((token: Token) => (token ? token.token : null)));
  gitHubOrganizations$: Observable<any> = this.select((state) => state.gitHubOrganizations);
  hasSourceControlToken$: Observable<boolean> = this.tokens$.pipe(
    map((tokens) => this.hasEntity(TokenSource.GITHUB) || this.hasEntity(TokenSource.BITBUCKET) || this.hasEntity(TokenSource.GITLAB))
  );
  userTokenStatusSet$: Observable<any> = this.tokens$.pipe(map((tokens) => (tokens ? this.getUserTokenStatusSet(tokens) : null)));
  tokenSetComplete$: Observable<boolean> = this.userTokenStatusSet$.pipe(
    map((tokenStatusSet) => (tokenStatusSet ? tokenStatusSet.github : false))
  );

  constructor(protected store: TokenStore) {
    super(store);
  }

  /**
   * Converts to tokens into a simplified object
   *
   * @param {Token[]} tokens The current tokens
   * @returns {*} Some weird object
   * @memberof TokenQuery
   */
  getUserTokenStatusSet(tokens: Token[]): any {
    const tokenStatusSet = {
      dockstore: false,
      github: false,
      bitbucket: false,
      quayio: false,
      gitlab: false,
      zenodo: false,
    };
    if (tokens) {
      tokens.forEach((token) => {
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
          case TokenSource.ZENODO:
            tokenStatusSet.zenodo = true;
            break;
        }
      });
    }
    return tokenStatusSet;
  }
}
