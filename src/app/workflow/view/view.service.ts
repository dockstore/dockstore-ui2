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
import { BehaviorSubject, Subject } from 'rxjs';
import { AlertService } from '../../shared/alert/state/alert.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowVersion } from '../../shared/swagger';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';

@Injectable()
export class ViewService {
  version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);

  constructor(
    private alertService: AlertService,
    private workflowQuery: WorkflowQuery,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService
  ) {}

  /**
   * Updates the workflow version and alerts the Dockstore User with success
   * or failure.
   *
   * @private
   * @memberof ViewService
   */

  updateDefaultVersion(newDefaultVersion: string): void {
    const workflowId = this.workflowQuery.getActive().id;
    const message = 'Updating default workflow version';
    this.alertService.start(message);
    this.workflowsService.updateWorkflowDefaultVersion(workflowId, newDefaultVersion).subscribe(
      (updatedWorkflow) => {
        this.alertService.detailedSuccess();
        this.workflowService.upsertWorkflowToWorkflow(updatedWorkflow);
        this.workflowService.setWorkflow(updatedWorkflow);
      },
      (error: HttpErrorResponse) => this.alertService.detailedError(error)
    );
  }
}
