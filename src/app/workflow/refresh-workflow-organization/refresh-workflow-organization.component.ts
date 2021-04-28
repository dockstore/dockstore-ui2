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
import { Component, Input } from '@angular/core';
import { EMPTY, from } from 'rxjs';
import { catchError, concatMap, takeUntil } from 'rxjs/operators';
import { OrgWorkflowObject } from '../../myworkflows/my-workflow/my-workflow.component';

import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { RefreshOrganizationComponent } from '../../shared/refresh-organization/refresh-organization.component';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowsService } from '../../shared/swagger';
import { Workflow } from '../../shared/swagger/model/workflow';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-refresh-workflow-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css'],
})
export class RefreshWorkflowOrganizationComponent extends RefreshOrganizationComponent {
  @Input() protected orgWorkflowObject: OrgWorkflowObject<Workflow>;

  constructor(
    userQuery: UserQuery,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
    private alertService: AlertService,
    protected alertQuery: AlertQuery,
    private extendedWorkflowQuery: ExtendedWorkflowQuery
  ) {
    super(userQuery, alertQuery);
    this.buttonText = 'Refresh Organization';
    this.tooltipText = 'Refresh all workflows in the organization';
  }

  refreshOrganization(): void {
    if (this.orgWorkflowObject) {
      const workflows = this.orgWorkflowObject.published.concat(this.orgWorkflowObject.unpublished);
      from(workflows)
        .pipe(
          concatMap((workflow) => {
            this.alertService.start(`Refreshing ${workflow.full_workflow_path}`);
            return this.workflowsService.refresh(workflow.id).pipe(
              catchError((error) => {
                this.alertService.detailedError(error);
                return EMPTY;
              })
            );
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          (workflow) => {
            const extendedWorkflow = this.extendedWorkflowQuery.getValue();
            if (extendedWorkflow && extendedWorkflow.id === workflow.id) {
              this.workflowService.setWorkflow(workflow);
            } else {
              this.workflowService.update(workflow.id, workflow);
            }
            this.alertService.detailedSuccess();
          },
          // This is likely redundant because it was already caught in the inner observable
          (err) => this.alertService.detailedError(err)
        );
    }
  }
}
