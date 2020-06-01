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
import { from } from 'rxjs';
import { concatMap, takeUntil } from 'rxjs/operators';
import { OrgWorkflowObject } from '../../myworkflows/my-workflow/my-workflow.component';

import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { RefreshOrganizationComponent } from '../../shared/refresh-organization/refresh-organization.component';
import { ExtendedWorkflowService } from '../../shared/state/extended-workflow.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { WorkflowsService } from '../../shared/swagger';
import { UsersService } from '../../shared/swagger/api/users.service';
import { Workflow } from '../../shared/swagger/model/workflow';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'app-refresh-workflow-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css']
})
export class RefreshWorkflowOrganizationComponent extends RefreshOrganizationComponent {
  @Input() protected orgWorkflowObject: OrgWorkflowObject<Workflow>;

  constructor(
    private usersService: UsersService,
    userQuery: UserQuery,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
    private alertService: AlertService,
    protected alertQuery: AlertQuery,
    private extendedWorkflowService: ExtendedWorkflowService
  ) {
    super(userQuery, alertQuery);
    this.buttonText = 'Refresh Organization';
  }

  refreshOrganization(): void {
    if (this.orgWorkflowObject) {
      const workflows = this.orgWorkflowObject.published.concat(this.orgWorkflowObject.unpublished);
      from(workflows)
        .pipe(
          concatMap(workflow => {
            this.alertService.start(`Refreshing ${workflow.full_workflow_path}`);
            return this.workflowsService.refresh(workflow.id);
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(
          workflow => {
            // Only need to update the active workflow. When switching to other workflows,
            // the UI fetches the latest content.
            this.extendedWorkflowService.updateIfActive(workflow);
            this.alertService.detailedSuccess();
          },
          err => this.alertService.detailedError(err)
        );
    }
  }
}
