import { Injectable } from '@angular/core';
import { MyEntriesStore } from './my-entries.store';

@Injectable()
export class MyEntriesStateService {
  constructor(private myEntriesStore: MyEntriesStore) {}

  setRefreshingMyEntries(refreshing: boolean): void {
    this.myEntriesStore.setState(state => {
      return {
        ...state,
        refreshingMyEntries: refreshing
      };
    });
  }
}
