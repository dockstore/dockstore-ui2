import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Token } from '../swagger';

export interface TokenState extends EntityState<Token> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'token', idKey: 'tokenSource' })
export class TokenStore extends EntityStore<TokenState, Token> {

  constructor() {
    super();
  }

}

