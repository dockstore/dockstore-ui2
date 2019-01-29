import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Collection } from '../../shared/swagger';

export interface CollectionState {
  collection: Collection;
}

export function createInitialState(): CollectionState {
  return {
    collection: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'collection' })
export class CollectionStore extends Store<CollectionState> {

  constructor() {
    super(createInitialState());
  }

}

