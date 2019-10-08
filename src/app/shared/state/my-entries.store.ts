import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';

export interface MyEntriesState {
  refreshingMyEntries: boolean;
  groupEntriesObject: Array<OrgWorkflowObject>;
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
