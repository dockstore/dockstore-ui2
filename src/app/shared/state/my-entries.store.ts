import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { OrgToolObject } from 'app/mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from 'app/myworkflows/my-workflow/my-workflow.component';

export interface MyEntriesState {
  refreshingMyEntries: boolean;
  groupEntriesObject: Array<OrgToolObject | OrgWorkflowObject>;
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
