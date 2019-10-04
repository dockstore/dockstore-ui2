import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface MyEntriesState {
  refreshingMyEntries: boolean;
  groupEntriesObject: Array<any>;
}

export function createInitialState(): MyEntriesState {
  return {
    refreshingMyEntries: false,
    groupEntriesObject: []
  };
}

@Injectable()
@StoreConfig({ name: 'my-entries' })
export class MyEntriesStore extends Store<MyEntriesState> {
  constructor() {
    super(createInitialState());
  }
}
