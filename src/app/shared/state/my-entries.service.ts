import { Injectable } from '@angular/core';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';
import { MyEntriesStore } from './my-entries.store';

@Injectable()
export class MyEntriesStateService {
  constructor(private myEntriesStore: MyEntriesStore) {}

  setRefreshingMyEntries(refreshing: boolean): void {
    this.myEntriesStore.update(state => {
      return {
        ...state,
        refreshingMyEntries: refreshing
      };
    });
  }

  setGroupEntriesObject(groupEntriesObject: Array<OrgWorkflowObject>): void {
    this.myEntriesStore.update(state => {
      return {
        ...state,
        groupEntriesObject: groupEntriesObject
      };
    });
  }
}
