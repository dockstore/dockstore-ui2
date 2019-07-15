import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';
import { ToolDescriptor } from '../swagger';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';
import { WorkflowState, WorkflowStore } from './workflow.store';

@Injectable({
  providedIn: 'root'
})
export class WorkflowQuery extends QueryEntity<WorkflowState, Service | BioWorkflow> {
  public workflow$: Observable<Service | BioWorkflow> = this.selectActive();
  public workflowId$: Observable<number> = this.workflow$.pipe(map((workflow: Service | BioWorkflow) => (workflow ? workflow.id : null)));
  public workflowIsPublished$: Observable<boolean> = this.workflow$.pipe(
    map((workflow: Service | BioWorkflow) => (workflow ? workflow.is_published : null))
  );
  public descriptorType$: Observable<ToolDescriptor.TypeEnum> = this.workflow$.pipe(
    map((workflow: Service | BioWorkflow) =>
      workflow ? this.descriptorTypeCompatService.stringToDescriptorType(workflow.descriptorType) : null
    )
  );
  public isNFL$: Observable<boolean> = this.descriptorType$.pipe(
    map((descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.NFL)
  );
  public isWDL$: Observable<boolean> = this.descriptorType$.pipe(
    map((descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.WDL)
  );
  constructor(protected store: WorkflowStore, private descriptorTypeCompatService: DescriptorTypeCompatService) {
    super(store);
  }
}
