import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Collection, Entry, Organization, WorkflowVersionPathInfo } from '../../shared/openapi';

export interface AliasesState {
  organization: Organization | null;
  collection: Collection | null;
  entry: Entry | null;
  workflowVersionPathInfo: WorkflowVersionPathInfo | null;
}

export function createInitialState(): AliasesState {
  return {
    organization: null,
    collection: null,
    entry: null,
    workflowVersionPathInfo: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'aliases' })
export class AliasesStore extends Store<AliasesState> {
  constructor() {
    super(createInitialState());
  }
}
