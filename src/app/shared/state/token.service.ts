import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { Observable, throwError } from 'rxjs';
import { Provider } from '../enum/provider.enum';
import { TokensService, UsersService } from '../swagger';
import { Token } from '../swagger/model/token';
import { TokenStore } from './token.store';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(
    private tokenStore: TokenStore,
    private tokensService: TokensService,
    private usersService: UsersService,
    private httpBackend: HttpBackend
  ) {}

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
      case Provider.ZENODO:
        return this.tokensService.addZenodoToken(token);
      default: {
        console.log('Unknown provider: ' + provider);
        return throwError('Unknown provider.');
      }
    }
  }
  deleteToken(tokenId: number) {
    return this.tokensService.deleteToken(tokenId);
  }

  setGitHubOrganizations(gitHubOrganizations: any) {
    this.tokenStore.update({ gitHubOrganizations: gitHubOrganizations });
  }

  getGitHubOrganizations(token: string | null) {
    if (token) {
      const httpClient = new HttpClient(this.httpBackend);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: 'token ' + token
        })
      };
      const getOrganizationUrl = 'https://api.github.com/user/orgs';
      httpClient.get(getOrganizationUrl, httpOptions).subscribe(gitHubOrganizations => this.setGitHubOrganizations(gitHubOrganizations));
    } else {
      this.setGitHubOrganizations([]);
    }
  }
}
