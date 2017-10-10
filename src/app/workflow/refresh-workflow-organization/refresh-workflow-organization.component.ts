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

import { Workflow } from './../../shared/swagger/model/workflow';
import { RefreshOrganizationComponent } from './../../shared/refresh-organization/refresh-organization.component';
import { StateService } from './../../shared/state.service';
import { WorkflowService } from './../../shared/workflow.service';
import { UserService } from '../../loginComponents/user.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-refresh-workflow-organization',
  // Note that the template and style is actually from the shared one (used by both my-workflows and my-tools)
  templateUrl: './../../shared/refresh-organization/refresh-organization.component.html',
  styleUrls: ['./../../shared/refresh-organization/refresh-organization.component.css']
})
export class RefreshWorkflowOrganizationComponent extends RefreshOrganizationComponent {

  constructor(private usersService: UsersService, userService: UserService, private workflowService: WorkflowService,
    public stateService: StateService) {
      super(userService, stateService);
  }

  refreshOrganization(): void {
    this.stateService.setRefreshMessage('Refreshing organization...');
    this.usersService.refreshWorkflowsByOrganization(this.userId, this.organization).subscribe(
      (success: Workflow[]) => {
        this.workflowService.setWorkflows(success);
        this.stateService.setRefreshMessage(null);
      }, error => this.stateService.setRefreshMessage(null));
  }
}
