import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { ToolClass } from '../enum/tool-class';
import { Workflow } from '../swagger';

export interface WorkflowState extends EntityState<Workflow> {
  toolClass: ToolClass;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Workflow> {

  constructor() {
    super();
  }

}

