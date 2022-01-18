import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface CreateCollectionState {
  title: string;
  saveLabel: string;
}

export function createInitialState(): CreateCollectionState {
  return {
    title: '',
    saveLabel: '',
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'create-collection' })
export class CreateCollectionStore extends Store<CreateCollectionState> {
  constructor() {
    super(createInitialState());
  }
}
