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

import { RefreshService } from '../../shared/refresh.service';
import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { ErrorService } from './../../shared/error.service';
import { ExtendedWorkflowService } from './../../shared/extended-workflow.service';
import { ExtendedWorkflow } from './../../shared/models/ExtendedWorkflow';
import { StateService } from './../../shared/state.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

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

    constructor(private workflowsService: WorkflowsService, private workflowService: WorkflowService, private stateService: StateService,
        private errorService: ErrorService, private refreshService: RefreshService,
        private extendedWorkflowService: ExtendedWorkflowService,
        private descriptorLanguageService: DescriptorLanguageService) {
        this.extendedWorkflowService.extendedWorkflow$.subscribe((workflow: ExtendedWorkflow) => {
            this.workflow = workflow;
            this.cancelEditing();
        });
        this.descriptorLanguageService.descriptorLanguages$.subscribe(map => this.descriptorLanguageMap = map);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }
    setWorkflowPathEditing(editing: boolean) {
        this.workflowPathEditing$.next(editing);
    }

    setDefaultTestFilePathEditing(editing: boolean) {
        this.defaultTestFilePathEditing$.next(editing);
    }

    updateAndRefresh(workflow: Workflow) {
        const message = 'Workflow Info';
        this.workflowsService.updateWorkflow(this.originalWorkflow.id, workflow).subscribe(response => {
            this.stateService.setRefreshMessage('Updating ' + message + '...');
            this.workflowsService.refresh(this.originalWorkflow.id).subscribe(refreshResponse => {
                this.workflowService.replaceWorkflow(this.workflows, refreshResponse);
                this.workflowService.setWorkflow(refreshResponse);
                this.refreshService.handleSuccess(message);
            }, error => {
                this.refreshService.handleError(message, error);
                this.restoreWorkflow();
            });
        });
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
}
