import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface CreateCollectionState {
   key: string;
}

export function createInitialState(): CreateCollectionState {
  return {
    key: ''
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'create-collection' })
export class CreateCollectionStore extends Store<CreateCollectionState> {

  constructor() {
    super(createInitialState());
  }

}

