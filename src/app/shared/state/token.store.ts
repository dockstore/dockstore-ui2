import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { TokenUser } from '../swagger';

export interface TokenState extends EntityState<TokenUser> {
  gitHubOrganizations: Array<any>;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'token', idKey: 'tokenSource' })
export class TokenStore extends EntityStore<TokenState, TokenUser> {
  constructor() {
    super();
  }
}
