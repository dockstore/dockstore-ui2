/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, merge as observableMerge, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { ContainerService } from './../../container.service';
import { ErrorService } from './../../error.service';
import { RefreshService } from './../../refresh.service';
import { StateService } from './../../state.service';
import { WorkflowsService } from './../../swagger/api/workflows.service';
import { DockstoreTool } from './../../swagger/model/dockstoreTool';
import { Entry } from './../../swagger/model/entry';
import { Workflow } from './../../swagger/model/workflow';
import { WorkflowService } from './../../workflow.service';

@Injectable()
export class RegisterCheckerWorkflowService {

    public isModalShown$ = new BehaviorSubject<boolean>(false);
    public refreshMessage$ = new BehaviorSubject<string>(null);
    public mode$ = new BehaviorSubject<'add' | 'edit'>('edit');
    public errorObj$: Observable<any>;
    public entryId$: Observable<number>;
    public entryId: number;
    constructor(private stateService: StateService, private errorService: ErrorService, private workflowsService: WorkflowsService,
        private containerService: ContainerService, private workflowService: WorkflowService, private refreshService: RefreshService) {
        this.refreshMessage$ = this.stateService.refreshMessage$;
        this.errorObj$ = this.errorService.errorObj$;
        this.entryId$ = observableMerge(this.containerService.toolId$, this.workflowService.workflowId$).pipe(filter(x => x != null));
        this.entryId$.subscribe((id: number) => {
            this.entryId = id;
        });
    }

    registerCheckerWorkflow(workflowPath: string, descriptorType: string, testParameterFilePath: string): void {
        if (this.entryId) {
            const message = 'Registering checker workflow';
            this.stateService.setRefreshMessage(message);
            // Figure out why testParameterFilePath and descriptorType is swapped
            this.workflowsService.registerCheckerWorkflow(workflowPath, this.entryId, testParameterFilePath, descriptorType).
                subscribe((entry: Entry) => {
                    // Only update our current list of workflows when the current entry is a workflow
                    // Switching to my-workflows will automatically update the entire list with a fresh HTTP request
                    if (entry.hasOwnProperty('is_checker')) {
                        this.workflowService.upsertWorkflowToWorkflow(<Workflow>entry);
                        this.workflowService.setWorkflow(<Workflow>entry);
                    } else {
                        this.containerService.upsertToolToTools(<DockstoreTool>entry);
                        this.containerService.setTool(<DockstoreTool>entry);
                    }
                    this.isModalShown$.next(false);
                    this.refreshService.handleSuccess(message);
                    const refreshCheckerMessage = 'Refreshing checker workflow';
                    this.stateService.setRefreshMessage(refreshCheckerMessage);
                    this.workflowsService.refresh(entry.checker_id).pipe(first()).subscribe((workflow: Workflow) => {
                        this.workflowService.upsertWorkflowToWorkflow(workflow);
                        this.refreshService.handleSuccess(refreshCheckerMessage);
                    }, error => {
                      this.refreshService.handleError(refreshCheckerMessage, error);
                    });
            }, error => {
                this.refreshService.handleError('Could not register checker workflow', error);
            });
        }
    }

    add(): void {
        this.mode$.next('add');
        this.showModal();
        // Placeholder for endpoint
    }

    delete(): void {
        // Placeholder for endpoint
    }

    showModal(): void {
        this.isModalShown$.next(true);
    }

    hideModal(): void {
        this.isModalShown$.next(false);
    }

    clearError(): void {
        this.errorService.setErrorAlert(null);
    }

}

