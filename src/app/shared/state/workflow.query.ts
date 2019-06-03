import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';
import { WorkflowClass } from '../enum/workflow-class';
import { ToolDescriptor, Workflow } from '../swagger';
import { WorkflowState, WorkflowStore } from './workflow.store';

@Injectable({
  providedIn: 'root'
})
export class WorkflowQuery extends QueryEntity<WorkflowState, Workflow> {
  public workflowClass$: Observable<WorkflowClass> = this.select(state => state.workflowClass);
  public workflowClassName$: Observable<string> = this.workflowClass$.pipe(map((workflowClass: WorkflowClass) => this.getWorkflowClass(workflowClass)));
  public workflow$: Observable<Workflow> = this.selectActive();
  public workflowId$: Observable<number> = this.workflow$.pipe(map((workflow: Workflow) => workflow ? workflow.id : null));
  public workflowIsPublished$: Observable<boolean> = this.workflow$.pipe(
    map((workflow: Workflow) => workflow ? workflow.is_published : null));
  public descriptorType$: Observable<ToolDescriptor.TypeEnum> = this.workflow$.pipe(
    map((workflow: Workflow) => workflow ? this.descriptorTypeCompatService.stringToDescriptorType(workflow.descriptorType) : null));
  public isNFL$: Observable<boolean> = this.descriptorType$.pipe(
    map((descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.NFL));
  public isWDL$: Observable<boolean> = this.descriptorType$.pipe(
    map((descriptorType: ToolDescriptor.TypeEnum) => descriptorType === ToolDescriptor.TypeEnum.WDL));
  constructor(protected store: WorkflowStore, private descriptorTypeCompatService: DescriptorTypeCompatService) {
    super(store);
  }

  private getWorkflowClass(workflowClass: WorkflowClass) {
    return workflowClass === WorkflowClass.BioWorkflow ? 'workflow' : 'service';
  }

}
