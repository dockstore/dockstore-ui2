import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { Observable, throwError } from 'rxjs';
import { Provider } from '../enum/provider.enum';
import { TokensService, UsersService } from '../swagger';
import { TokenUser } from '../swagger/model/tokenUser';
import { TokenStore } from './token.store';

@Injectable({ providedIn: 'root' })
export class TokenService {
  constructor(private tokenStore: TokenStore, private tokensService: TokensService, private usersService: UsersService) {}

  @transaction()
  get(userId: number) {
    this.tokenStore.remove();
    if (userId) {
      this.usersService.getUserTokens(userId).subscribe((tokens: Array<TokenUser>) => {
        this.tokenStore.add(tokens);
      });
    }
  }

  add(token: TokenUser) {
    this.tokenStore.add(token);
  }

  update(id: ID, token: Partial<TokenUser>) {
    this.tokenStore.update(id, token);
  }

  remove(id: ID) {
    this.tokenStore.remove(id);
  }

  removeAll() {
    this.tokenStore.remove();
  }

  registerToken(token: string, provider: Provider): Observable<TokenUser> {
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
      case Provider.ORCID:
        return this.tokensService.addOrcidToken(token);
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
