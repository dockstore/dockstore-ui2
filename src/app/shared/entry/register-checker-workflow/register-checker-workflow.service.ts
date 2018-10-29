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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, merge as observableMerge, Observable } from 'rxjs';
import { filter, first } from 'rxjs/operators';

import { AlertService } from '../../alert/state/alert.service';
import { ContainerService } from '../../container.service';
import { RefreshService } from '../../refresh.service';
import { WorkflowQuery } from '../../state/workflow.query';
import { WorkflowService } from '../../state/workflow.service';
import { WorkflowsService } from '../../swagger/api/workflows.service';
import { DockstoreTool } from '../../swagger/model/dockstoreTool';
import { Entry } from '../../swagger/model/entry';
import { Workflow } from '../../swagger/model/workflow';
import { ToolQuery } from '../../tool/tool.query';
import { ToolDescriptor } from '../../swagger';

@Injectable()
export class RegisterCheckerWorkflowService {
    public isModalShown$ = new BehaviorSubject<boolean>(false);
    public mode$ = new BehaviorSubject<'add' | 'edit'>('edit');
    public entryId$: Observable<number>;
    public entryId: number;
    constructor(private workflowsService: WorkflowsService,
        private containerService: ContainerService, private workflowService: WorkflowService, private refreshService: RefreshService,
        private toolQuery: ToolQuery, private workflowQuery: WorkflowQuery, private alertService: AlertService) {
        this.entryId$ = observableMerge(this.toolQuery.toolId$, this.workflowQuery.workflowId$).pipe(filter(x => x != null));
        this.entryId$.subscribe((id: number) => {
            this.entryId = id;
        });
    }

    registerCheckerWorkflow(workflowPath: string, testParameterFilePath: string, descriptorType: ToolDescriptor.TypeEnum): void {
      // The webservice currently does not accept the proper upper case descriptor types (CWL, WDL, NFL) when registering.
      const badDescriptorType = descriptorType.toLowerCase();
        if (this.entryId) {
            const message = 'Registering checker workflow';
            this.alertService.start(message);
            // Figure out why testParameterFilePath and descriptorType is swapped
            this.workflowsService.registerCheckerWorkflow(workflowPath, this.entryId, badDescriptorType, testParameterFilePath).
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
                    const refreshCheckerMessage = 'Refreshing checker workflow';
                    this.workflowsService.refresh(entry.checker_id).pipe(first()).subscribe((workflow: Workflow) => {
                        this.isModalShown$.next(false);
                        this.workflowService.upsertWorkflowToWorkflow(workflow);
                        this.alertService.detailedSuccess();
                    }, (error: HttpErrorResponse) => {
                      this.alertService.detailedError(error);
                    });
            }, (error: HttpErrorResponse) => {
              this.alertService.detailedError(error);
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
}

