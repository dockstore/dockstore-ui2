import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';

export interface WorkflowState extends EntityState<Service | BioWorkflow> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Service | BioWorkflow> {
  constructor() {
    super();
  }
}
