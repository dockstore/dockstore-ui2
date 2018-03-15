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
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { StateService } from './../../shared/state.service';
import { MetadataService } from './../../shared/swagger/api/metadata.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

@Injectable()
export class RegisterWorkflowModalService {
    workflowRegisterError$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private descriptorLanguageMap = [];
    sampleWorkflow: Workflow = <Workflow>{};
    actualWorkflow: Workflow;
    private sourceControlMap = [];
    workflows: any;
    isModalShown$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(
        this.sampleWorkflow);
    constructor(private workflowsService: WorkflowsService,
        private workflowService: WorkflowService,
        private stateService: StateService, private descriptorLanguageService: DescriptorLanguageService,
        private metadataService: MetadataService) {
        this.sampleWorkflow.repository = 'GitHub';
        this.sampleWorkflow.descriptorType = 'cwl';
        this.sampleWorkflow.workflowName = '';
        this.metadataService.getSourceControlList().subscribe(map => this.sourceControlMap = map);
        this.descriptorLanguageService.descriptorLanguages$.subscribe(map => this.descriptorLanguageMap = map);
        this.workflow.subscribe(workflow => this.actualWorkflow = workflow);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }

    clearWorkflowRegisterError() {
        this.workflowRegisterError$.next(null);
    }

    setIsModalShown(isModalShown: boolean) {
        this.isModalShown$.next(isModalShown);
    }

    setWorkflowRegisterError(message: any, errorDetails) {
        const error = {
            message: message,
            errorDetails: errorDetails
        };
        this.workflowRegisterError$.next(error);
        this.stateService.refreshMessage$.next(null);
    }

    setWorkflow(workflow: Workflow) {
        this.workflow.next(workflow);
    }

    setWorkflowRepository(repository) {
        this.actualWorkflow.gitUrl = repository;
        this.setWorkflow(this.actualWorkflow);
    }

    registerWorkflow() {
        this.stateService.setRefreshMessage('Registering workflow...');
        this.workflowsService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType,
            this.actualWorkflow.defaultTestParameterFilePath).subscribe(result => {
                this.workflowsService.refresh(result.id).subscribe(refreshResult => {
                    this.workflows.push(refreshResult);
                    this.workflowService.setWorkflows(this.workflows);
                    this.workflowService.setWorkflow(refreshResult);
                    this.stateService.setRefreshMessage(null);
                    this.setIsModalShown(false);
                    this.clearWorkflowRegisterError();
                }, error => this.stateService.setRefreshMessage(null));
            }, error => this.setWorkflowRegisterError('The webservice encountered an error trying to create this ' +
                'workflow, please ensure that the workflow attributes are ' +
                'valid and the same image has not already been registered.', '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error.error)
            );
    }

    friendlyRepositoryKeys(): Array<string> {
        if (this.sourceControlMap) {
            return this.sourceControlMap.map((a) => a.friendlyName);
        }
    }

    getDescriptorLanguageKeys(): Array<string> {
      if (this.descriptorLanguageMap) {
        return this.descriptorLanguageMap.map((a) => a.value);
      }
    }
}
