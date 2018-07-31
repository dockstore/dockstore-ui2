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
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { StateService } from './../../shared/state.service';
import { HostedService } from './../../shared/swagger/api/hosted.service';
import { MetadataService } from './../../shared/swagger/api/metadata.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

@Injectable()
export class RegisterWorkflowModalService {
    workflowRegisterError$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private descriptorLanguageMap: Array<string> = [];
    sampleWorkflow: Workflow = <Workflow>{};
    actualWorkflow: Workflow;
    private sourceControlMap = [];
    workflows: any;
    isModalShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public descriptorLanguages$: Observable<Array<string>>;
    workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(
        this.sampleWorkflow);
    constructor(private workflowsService: WorkflowsService,
        private workflowService: WorkflowService, private router: Router,
        private stateService: StateService, private descriptorLanguageService: DescriptorLanguageService,
        private metadataService: MetadataService, private hostedService: HostedService) {
        this.sampleWorkflow.repository = 'GitHub';
        this.sampleWorkflow.descriptorType = 'cwl';
        this.sampleWorkflow.workflowName = '';
        this.metadataService.getSourceControlList().subscribe(map => this.sourceControlMap = map);
        this.descriptorLanguageService.descriptorLanguages$.subscribe(map => this.descriptorLanguageMap = map);
        this.descriptorLanguages$ = this.descriptorLanguageService.descriptorLanguages$;
        this.workflow.subscribe(workflow => this.actualWorkflow = workflow);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
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
            errorDetails: ''
          };
        } else {
          errorObj = {
              message: 'The webservice encountered an error trying to create this ' +
              'workflow, please ensure that the workflow attributes are ' +
              'valid.',
              errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
              error.error
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

    registerWorkflow() {
        this.clearWorkflowRegisterError();
        this.stateService.setRefreshMessage('Registering new workflow...');
        this.workflowsService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType,
            this.actualWorkflow.defaultTestParameterFilePath).subscribe(result => {
              this.stateService.setRefreshMessage('Refreshing new workflow...');
                this.workflowsService.refresh(result.id).pipe(finalize(() => {
                  this.stateService.setRefreshMessage(null);
                })).subscribe(refreshResult => {
                    this.workflows.push(refreshResult);
                    this.workflowService.setWorkflows(this.workflows);
                    this.setIsModalShown(false);
                    this.router.navigateByUrl('/my-workflows' + '/' + refreshResult.full_workflow_path);
                }, error => this.setWorkflowRegisterError(error));
            }, error =>  {
              this.stateService.setRefreshMessage(null);
              this.setWorkflowRegisterError(error);
            });
    }

    /**
     * Registers a hosted workflow
     * @param  hostedWorkflow hosted workflow object
     */
    registerHostedWorkflow(hostedWorkflow) {
      this.clearWorkflowRegisterError();
      this.stateService.setRefreshMessage('Registering new workflow...');
      this.hostedService.createHostedWorkflow(
          hostedWorkflow.name,
          hostedWorkflow.descriptorType).pipe(finalize(() => {
            this.stateService.setRefreshMessage(null);
          })).subscribe(result => {
            this.workflows.push(result);
            this.workflowService.setWorkflows(this.workflows);
            this.setIsModalShown(false);
            this.clearWorkflowRegisterError();
            this.router.navigateByUrl('/my-workflows' + '/' + result.full_workflow_path);
          }, error =>  {
            this.setWorkflowRegisterError(error);
          });
    }

    friendlyRepositoryKeys(): Array<string> {
        if (this.sourceControlMap) {
            return this.sourceControlMap.map((a) => a.friendlyName);
        }
    }

    getDescriptorLanguageKeys(): Array<string> {
      return this.descriptorLanguageMap;
    }
}
