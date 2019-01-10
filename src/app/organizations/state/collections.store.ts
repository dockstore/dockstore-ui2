import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

import { Collection } from '../../shared/swagger';

export interface CollectionsState {
   collections: Array<Collection>;
}

export function createInitialState(): CollectionsState {
  return {
    collections: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'collections' })
export class CollectionsStore extends Store<CollectionsState> {

  constructor() {
    super(createInitialState());
  }

}

