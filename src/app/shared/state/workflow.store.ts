import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Workflow } from '../swagger';

export interface WorkflowState extends EntityState<Workflow> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Workflow> {

  constructor() {
    super();
  }

}

