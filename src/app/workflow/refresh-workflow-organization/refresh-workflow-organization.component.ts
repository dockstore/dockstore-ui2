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
    this.stateService.setRefreshing(true);
    this.usersService.refreshWorkflowsByOrganization(this.userId, this.organization).subscribe(
      (success: Workflow[]) => {
        this.workflowService.setWorkflows(success);
        this.stateService.setRefreshing(false);
      }, error => this.stateService.setRefreshing(false));
  }
}
