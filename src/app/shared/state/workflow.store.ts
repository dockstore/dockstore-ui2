import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WorkflowVersion } from '../openapi';
import { BioWorkflow } from '../openapi/model/bioWorkflow';
import { Service } from '../openapi/model/service';

export interface WorkflowState extends EntityState<Service | BioWorkflow>, ActiveState {
  version: WorkflowVersion;
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Service | BioWorkflow> {
  constructor() {
    super();
  }
}
