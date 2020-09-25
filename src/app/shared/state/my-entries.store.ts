import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface MyEntriesState {
  refreshingMyEntries: boolean;
}

export function createInitialState(): MyEntriesState {
  return {
    refreshingMyEntries: false,
  };
}

@Injectable()
@StoreConfig({ name: 'my-entries' })
export class MyEntriesStore extends Store<MyEntriesState> {
  constructor() {
    super(createInitialState());
  }
}
