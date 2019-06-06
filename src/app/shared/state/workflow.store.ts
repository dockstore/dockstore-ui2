import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { EntryType } from '../enum/entry-type';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';

export interface WorkflowState extends EntityState<Service | BioWorkflow> {
  entryType: EntryType;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Service | BioWorkflow> {
  constructor() {
    super();
  }
}
