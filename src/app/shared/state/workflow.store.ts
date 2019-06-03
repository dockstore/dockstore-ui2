import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WorkflowClass } from '../enum/workflow-class';
import { Workflow } from '../swagger';

export interface WorkflowState extends EntityState<Workflow> {
  workflowClass: WorkflowClass;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Workflow> {

  constructor() {
    super();
  }

}

