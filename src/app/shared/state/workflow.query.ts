import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WorkflowStore, WorkflowState } from './workflow.store';
import { Workflow, ToolDescriptor } from '../swagger';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';

@Injectable({
  providedIn: 'root'
})
export class WorkflowQuery extends QueryEntity<WorkflowState, Workflow> {
  public workflow$: Observable<Workflow> = this.selectActive();
  public workflowId$: Observable<number> = this.workflow$.pipe(map((workflow: Workflow) => workflow ? workflow.id : null));
  public workflowIsPublished$: Observable<boolean> = this.workflow$.pipe(
    map((workflow: Workflow) => workflow ? workflow.is_published : null));
  public descriptorType$: Observable<ToolDescriptor.TypeEnum> = this.workflow$.pipe(
    map((workflow: Workflow) => workflow ? this.descriptorTypeCompatService.stringToDescriptorType(workflow.descriptorType) : null));
  public isNFL$: Observable<boolean> = this.descriptorType$.pipe(
    map((descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.NFL));
  public isWDL$: Observable<boolean> = this.descriptorType$.pipe(
    map( (descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.WDL));
  constructor(protected store: WorkflowStore, private descriptorTypeCompatService: DescriptorTypeCompatService) {
    super(store);
  }

}
