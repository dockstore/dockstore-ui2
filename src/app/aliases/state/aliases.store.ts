import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Organization, Collection } from '../../shared/swagger';

export interface AliasesState {
   organization: Organization | null;
   collection: Collection | null;
}

export function createInitialState(): AliasesState {
  return {
    organization: null,
    collection: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'aliases' })
export class AliasesStore extends Store<AliasesState> {

  constructor() {
    super(createInitialState());
  }

}

