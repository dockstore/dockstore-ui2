import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { WorkflowVersion } from '../swagger';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';

export interface WorkflowState extends EntityState<Service | BioWorkflow>, ActiveState {
  version: WorkflowVersion;
  isAppTool: boolean;
}

// export function createInitialState(): WorkflowState {
//   return {
//     isAppTool: undefined
//   }
// }

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'workflow' })
export class WorkflowStore extends EntityStore<WorkflowState, Service | BioWorkflow> {
  constructor() {
    super();
  }
}
