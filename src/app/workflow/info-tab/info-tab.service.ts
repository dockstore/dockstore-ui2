/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from 'app/shared/constants';
import { Dockstore } from 'app/shared/dockstore.model';
import { EntryType } from 'app/shared/enum/entry-type';
import { BehaviorSubject } from 'rxjs';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DescriptorTypeCompatService } from '../../shared/descriptor-type-compat.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor } from '../../shared/swagger';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Workflow } from '../../shared/swagger/model/workflow';

@Injectable()
export class InfoTabService {
  public workflowPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public defaultTestFilePathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private workflows: Workflow[];
  public descriptorLanguageMap = [];

  /**
   * The original workflow that should be in sync with the database
   *
   * @private
   * @type {Workflow}
   * @memberof InfoTabService
   */
  private originalWorkflow: any;

  /**
   * The workflow with info that may have been modified but not saved
   *
   * @private
   * @type {Workflow}
   * @memberof InfoTabService
   */
  private currentWorkflow: any;

  constructor(
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private alertService: AlertService,
    private extendedWorkflowQuery: ExtendedWorkflowQuery,
    private descriptorTypeCompatService: DescriptorTypeCompatService,
    private descriptorLanguageService: DescriptorLanguageService
  ) {
    this.extendedWorkflowQuery.extendedWorkflow$.subscribe((workflow: ExtendedWorkflow) => {
      this.workflow = workflow;
      this.cancelEditing();
    });
    this.descriptorLanguageService.filteredDescriptorLanguages$.subscribe(map => (this.descriptorLanguageMap = map));
    this.workflowService.workflows$.subscribe(workflows => (this.workflows = workflows));
  }
  setWorkflowPathEditing(editing: boolean) {
    this.workflowPathEditing$.next(editing);
  }

  setDefaultTestFilePathEditing(editing: boolean) {
    this.defaultTestFilePathEditing$.next(editing);
  }

  updateAndRefresh(workflow: Workflow) {
    const message = 'Workflow Info';
    workflow.workflowVersions = [];
    this.workflowsService.updateWorkflow(this.originalWorkflow.id, workflow).subscribe(response => {
      this.alertService.start('Updating ' + message);
      this.workflowsService.refresh(this.originalWorkflow.id).subscribe(
        refreshResponse => {
          this.workflowService.upsertWorkflowToWorkflow(refreshResponse);
          this.workflowService.setWorkflow(refreshResponse);
          this.alertService.detailedSuccess();
        },
        error => {
          this.alertService.detailedError(error);
          this.restoreWorkflow();
        }
      );
    });
  }

  /**
   * This updates the workflow without refreshing
   *
   * @param {Workflow} workflow The updated workflow to send
   * @memberof InfoTabService
   */
  update(workflow: Workflow) {
    const message = 'Descriptor Type';
    this.alertService.start('Updating ' + message);
    workflow = this.changeWorkflowPathToDefaults(workflow);
    workflow.workflowVersions = [];
    this.workflowsService.updateWorkflow(this.originalWorkflow.id, workflow).subscribe(
      (updatedWorkflow: Workflow) => {
        this.workflowService.upsertWorkflowToWorkflow(updatedWorkflow);
        this.alertService.detailedSuccess();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Change workflow path to the defaults based on the descriptor type
   *
   * @private
   * @param {Workflow} workflow The original stubbed workflow with a newly modified descriptor type
   * @returns {Workflow} The new workflow with the default workflow path set to match the new descriptor type
   * @memberof InfoTabService
   */
  private changeWorkflowPathToDefaults(workflow: Workflow): Workflow {
    const descriptorType: ToolDescriptor.TypeEnum = this.descriptorTypeCompatService.stringToDescriptorType(workflow.descriptorType);
    switch (descriptorType) {
      case ToolDescriptor.TypeEnum.CWL:
        workflow.workflow_path = '/Dockstore.cwl';
        break;
      case ToolDescriptor.TypeEnum.WDL:
        workflow.workflow_path = '/Dockstore.wdl';
        break;
      case ToolDescriptor.TypeEnum.NFL:
        workflow.workflow_path = '/nextflow.config';
        break;
      default:
        break;
    }
    return workflow;
  }

  get workflow(): ExtendedWorkflow {
    return this.currentWorkflow;
  }

  set workflow(workflow: ExtendedWorkflow) {
    this.originalWorkflow = workflow;
    this.currentWorkflow = Object.assign({}, workflow);
  }

  /**
   * Cancels editing for all editable fields and reverts the workflow back to the original
   *
   * @memberof InfoTabService
   */
  cancelEditing(): void {
    this.workflowPathEditing$.next(false);
    this.restoreWorkflow();
  }

  /**
   * Reverts the workflow info back to the original
   *
   * @memberof InfoTabService
   */
  restoreWorkflow(): void {
    this.workflow = this.originalWorkflow;
  }

  /**
   * Saves the current workflow into the workflow variable
   *
   * @memberof InfoTabService
   */
  saveWorkflow(): void {
    this.workflow = this.currentWorkflow;
  }

  /**
   * Returns a link to the primary descriptor for the given workflow version
   *
   * @param {string} path full workflow path
   * @param {string} versionName name of version
   * @param {string} descriptorType descriptor type (CWL or WDL)
   * @param {string} descriptorPath primary descriptor path
   * @param {EntryType} entryType the entry type (EntryType.Service or EntryType.BioWorkflow)
   * @returns {string}  the link to the TRS primary descriptor
   * @memberof InfoTabService
   */
  getTRSLink(path: string, versionName: string, descriptorType: string, descriptorPath: string, entryType: EntryType): string {
    // const prefix: string = entryType === EntryType.BioWorkflow ? ga4ghWorkflowIdPrefix : ga4ghServiceIdPrefix;
    // Currently they're both using the same prefix in the webservice
    const prefix = ga4ghWorkflowIdPrefix;
    return (
      `${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent(prefix + path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-` +
      descriptorType.toUpperCase() +
      `/descriptor/` +
      descriptorPath
    );
  }
}
