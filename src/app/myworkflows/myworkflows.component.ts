import { UserService } from './../loginComponents/user.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { HttpService } from './../shared/http.service';
import { Configuration } from './../shared/swagger/configuration';
import { RegisterWorkflowModalService } from './../workflow/register-workflow-modal/register-workflow-modal.service';
import { RefreshService } from './../shared/refresh.service';
import { Component, OnInit } from '@angular/core';

import { DockstoreService } from '../shared/dockstore.service';
import { ProviderService } from '../shared/provider.service';
import { WorkflowService } from '../shared/workflow.service';

import { MyWorkflowsService } from './myworkflows.service';

@Component({
  selector: 'app-myworkflows',
  templateUrl: './myworkflows.component.html',
  styleUrls: ['./myworkflows.component.css'],
  providers: [MyWorkflowsService, ProviderService,
    DockstoreService]
})
export class MyWorkflowsComponent implements OnInit {
  orgWorkflows = [];
  oneAtATime = true;
  workflow: any;
  user: any;
  workflows: any;
  constructor(private myworkflowService: MyWorkflowsService, private configuration: Configuration,
    private httpService: HttpService, private usersService: UsersService, private userService: UserService,
    private workflowService: WorkflowService,
    private refreshService: RefreshService,
    private registerWorkflowModalService: RegisterWorkflowModalService) {

  }

  ngOnInit() {
    this.configuration.accessToken = this.httpService.getDockstoreToken();
    this.workflowService.setWorkflow(null);
    this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        this.setIsFirstOpen();
      }
    );
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.usersService.userWorkflows(user.id).subscribe(workflows => {
          this.workflowService.setWorkflows(workflows);
        });
      }
    });
    this.workflowService.workflows$.subscribe(workflows => {
      this.workflows = workflows;
      if (this.user) {
        const sortedWorkflows = this.myworkflowService.sortORGWorkflows(workflows, this.user.username);
        this.workflowService.setNsWorkflows(sortedWorkflows);
      }
    });
    this.workflowService.nsWorkflows$.subscribe(nsWorkflows => {
      this.orgWorkflows = nsWorkflows;
      if (this.orgWorkflows && this.orgWorkflows.length > 0) {
        const theFirstWorkflow = this.orgWorkflows[0].workflows[0];
        this.selectWorkflow(theFirstWorkflow);
      } else {
        this.selectWorkflow(null);
      }
    });
  }
  setIsFirstOpen() {
    if (this.orgWorkflows && this.workflow) {
      for (const orgObj of this.orgWorkflows) {
        if (this.containSelectedWorkflow(orgObj)) {
          orgObj.isFirstOpen = true;
          break;
        }
      }
    }
  }
  containSelectedWorkflow(orgObj) {
    const workflows: Array<any> = orgObj.workflows;
    if (workflows.find(workflow => workflow.id === this.workflow.id)) {
      return true;
    } else {
      return false;
    }
  }
  selectWorkflow(workflow) {
    this.workflow = workflow;
    this.workflowService.setWorkflow(workflow);
  }

  setModalGitURL(gitURL: string) {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showModal() {
    this.registerWorkflowModalService.setIsModalShown(true);
  }

  refreshAllWorkflows(): any {
    this.refreshService.refreshAllWorkflows(this.user.id);
  }
}
