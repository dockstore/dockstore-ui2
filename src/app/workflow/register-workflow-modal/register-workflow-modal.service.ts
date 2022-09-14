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
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { HostedService, MetadataService, Workflow, WorkflowsService } from '../../shared/swagger';
import { RegisterWorkflowModalComponent } from './register-workflow-modal.component';

import DescriptorTypeEnum = Workflow.DescriptorTypeEnum;

@Injectable()
export class RegisterWorkflowModalService {
  workflowRegisterError$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private descriptorLanguageMap: Array<string> = [];
  sampleWorkflow: Workflow = <Workflow>{};
  actualWorkflow: Workflow;
  private sourceControlMap = [];
  workflows: Array<any>;
  isModalShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  public descriptorLanguages$: Observable<Array<DescriptorTypeEnum>>;
  public filteredDescriptorLanguages$: Observable<Array<DescriptorTypeEnum>>;
  workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(this.sampleWorkflow);
  constructor(
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private router: Router,
    private alertService: AlertService,
    private descriptorLanguageService: DescriptorLanguageService,
    private metadataService: MetadataService,
    private hostedService: HostedService
  ) {
    this.sampleWorkflow.repository = 'GitHub';
    // Setting a ToolDescriptor.TypeEnum to a workflow's descriptorType is currently weird
    // because it's not supposed to be compatible yet (in the webservice)
    this.sampleWorkflow.descriptorType = Workflow.DescriptorTypeEnum.CWL;
    this.sampleWorkflow.workflowName = '';
    this.metadataService.getSourceControlList().subscribe((map) => (this.sourceControlMap = map));
    this.descriptorLanguageService.descriptorLanguages$.subscribe((map) => (this.descriptorLanguageMap = map));
    this.descriptorLanguages$ = this.descriptorLanguageService.filteredDescriptorLanguages$;
    this.workflow.subscribe((workflow) => (this.actualWorkflow = workflow));
    this.workflowService.workflows$.subscribe((workflows) => (this.workflows = workflows));
  }

  clearWorkflowRegisterError() {
    this.workflowRegisterError$.next(null);
  }

  setIsModalShown(isModalShown: boolean) {
    this.isModalShown$.next(isModalShown);
  }

  setWorkflowRegisterError(error: HttpErrorResponse) {
    let errorObj = null;
    if (error) {
      if (error.status === 0) {
        errorObj = {
          message: 'The webservice is currently down, possibly due to load. Please wait and try again later.',
          errorDetails: '',
        };
      } else {
        errorObj = {
          message:
            'The webservice encountered an error trying to create this ' +
            'workflow, please ensure that the workflow attributes are ' +
            'valid.',
          errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' + error.error,
        };
      }
    }
    this.workflowRegisterError$.next(errorObj);
  }

  setWorkflow(workflow: Workflow) {
    this.workflow.next(workflow);
  }

  setWorkflowRepository(repository) {
    this.actualWorkflow.gitUrl = repository;
    this.setWorkflow(this.actualWorkflow);
  }

  registerWorkflow(dialogRef: MatDialogRef<RegisterWorkflowModalComponent>) {
    this.clearWorkflowRegisterError();
    this.alertService.start('Registering new workflow');
    const lowerCaseDescriptorType = this.actualWorkflow.descriptorType.toLowerCase();
    this.workflowsService
      .manualRegister(
        this.actualWorkflow.repository,
        this.actualWorkflow.gitUrl,
        this.actualWorkflow.workflow_path,
        this.actualWorkflow.workflowName,
        lowerCaseDescriptorType,
        this.actualWorkflow.defaultTestParameterFilePath
      )
      .subscribe(
        (result) => {
          this.workflowsService.refresh(result.id).subscribe(
            (refreshResult) => {
              this.workflows.push(refreshResult);
              this.alertService.detailedSuccess();
              dialogRef.close();
              this.handleNewWorkflow(this.workflows, refreshResult);
            },
            (error: HttpErrorResponse) => this.alertService.detailedError(error)
          );
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
          this.setWorkflowRegisterError(error);
        }
      );
  }

  /**
   * Registers a hosted workflow
   * @param  hostedWorkflow hosted workflow object
   */
  registerHostedWorkflow(hostedWorkflow, dialogRef: MatDialogRef<RegisterWorkflowModalComponent>) {
    this.clearWorkflowRegisterError();
    const descriptorLanguageEnum = this.descriptorLanguageService.workflowDescriptorTypeEnumToExtendedDescriptorLanguageBean(
      hostedWorkflow.descriptorType
    ).descriptorLanguageEnum;
    this.alertService.start('Registering new workflow');
    this.hostedService
      .createHostedWorkflow(
        hostedWorkflow.repository,
        undefined,
        descriptorLanguageEnum,
        undefined,
        hostedWorkflow.entryName ? hostedWorkflow.entryName : undefined
      )
      .subscribe(
        (result) => {
          this.alertService.detailedSuccess();
          this.workflows.push(result);
          dialogRef.close();
          this.clearWorkflowRegisterError();
          this.handleNewWorkflow(this.workflows, result);
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
  }

  friendlyRepositoryKeys(): Array<string> {
    if (this.sourceControlMap) {
      return this.sourceControlMap.map((a) => a.friendlyName);
    }
  }

  handleNewWorkflow(workflows: Array<any>, workflow: Workflow): void {
    this.workflowService.setWorkflows(workflows);
    this.router.navigateByUrl('/my-workflows' + '/' + workflow.full_workflow_path);
  }

  getDescriptorLanguageKeys(): Array<string> {
    return this.descriptorLanguageMap;
  }
}
