import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ExtendedDescriptorLanguage, extendedDescriptorLanguages, extendedUnknownDescriptor } from 'app/entry/extendedDescriptorLanguage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DescriptorTypeCompatService } from '../descriptor-type-compat.service';
import { ToolDescriptor, Workflow } from '../swagger';
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
  public extendedDescriptorLanguageBean$: Observable<ExtendedDescriptorLanguage> = this.workflow$.pipe(
    map(workflow => this.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(workflow.descriptorType))
  );
  public launchSupport$: Observable<boolean> = this.extendedDescriptorLanguageBean$.pipe(
    map(extendedDescriptorLanguage => extendedDescriptorLanguage.workflowLaunchSupport)
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

  /**
   * Converts the Workflow.DescriptorTypeEnum to the ExtendedDescriptorLanguage that's used throughout the frontend
   *
   * @private
   * @param {Workflow.DescriptorTypeEnum} descriptorType  Typically the "workflow.descriptorType"
   * @returns {ExtendedDescriptorLanguage}  ExtendedDescriptorLanguage that's used throughout
   * @memberof WorkflowQuery
   */
  private workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(
    descriptorType: Workflow.DescriptorTypeEnum
  ): ExtendedDescriptorLanguage {
    const foundextendedDescriptorLanguageFromValue = extendedDescriptorLanguages.find(
      extendedDescriptorLanguage => extendedDescriptorLanguage.workflowDescriptorEnum === descriptorType
    );
    if (foundextendedDescriptorLanguageFromValue) {
      return foundextendedDescriptorLanguageFromValue;
    }
    return extendedUnknownDescriptor;
  }
}
