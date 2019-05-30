import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';
import { ToolClass } from '../enum/tool-class';
import { ToolDescriptor, Workflow } from '../swagger';
import { WorkflowState, WorkflowStore } from './workflow.store';

@Injectable({
  providedIn: 'root'
})
export class WorkflowQuery extends QueryEntity<WorkflowState, Workflow> {
  public toolClass$: Observable<ToolClass> = this.select(state => state.toolClass);
  public title$: Observable<string> = this.toolClass$.pipe(map((toolClass: ToolClass) => this.getTitle(toolClass)));
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

  private getTitle(toolClass: ToolClass) {
    return toolClass === ToolClass.BioWorkflow ? 'My workflows' : 'My services';
  }

}
