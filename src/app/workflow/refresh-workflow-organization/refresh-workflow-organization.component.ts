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
import { Component } from '@angular/core';

import { UserService } from '../../loginComponents/user.service';
import { RefreshService } from '../../shared/refresh.service';
import { SessionQuery } from '../../shared/session/session.query';
import { SessionService } from '../../shared/session/session.service';
import { RefreshOrganizationComponent } from './../../shared/refresh-organization/refresh-organization.component';
import { UsersService } from './../../shared/swagger/api/users.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';

@Component({
  selector: 'app-refresh-workflow-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css']
})
export class RefreshWorkflowOrganizationComponent extends RefreshOrganizationComponent {

  constructor(private usersService: UsersService, userService: UserService, private workflowService: WorkflowService,
    public sessionService: SessionService, private refreshService: RefreshService, protected sessionQuery: SessionQuery) {
      super(userService, sessionQuery);
  }

  refreshOrganization(): void {
    const message = 'Refreshing ' + this.organization;
    this.sessionService.setRefreshMessage(message + '...');
    this.usersService.refreshWorkflowsByOrganization(this.userId, this.organization).subscribe(
      (success: Workflow[]) => {
        this.workflowService.setWorkflows(success);
        this.refreshService.handleSuccess(message);
      }, error => this.refreshService.handleError(message, error));
  }
}
