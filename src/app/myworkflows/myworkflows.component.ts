import { Component, ViewChild } from '@angular/core';

import {Router} from '@angular/router';

import {CommunicatorService} from '../shared/communicator.service';
import {DockstoreService} from '../shared/dockstore.service';
import {MyWorkflowsService} from './myworkflows.service';
import {ProviderService} from '../shared/provider.service';
import {Tool} from '../shared/tool';
import {ToolService} from '../shared/tool.service';
import {UserService} from '../loginComponents/user.service';

import { WorkflowObjService } from '../shared/workflow.service';
import {WorkflowComponent} from '../workflow/workflow.component';

@Component({
  selector: 'app-myworkflows',
  templateUrl: './myworkflows.component.html',
  styleUrls: ['./myworkflows.component.css'],
  providers: [MyWorkflowsService, ProviderService,
              DockstoreService, CommunicatorService, WorkflowObjService]
})
export class MyWorkflowsComponent {
  user;
  userWorkflows = [];
  orgWorkflows = [];
  oneAtATime = true;
  hi: string;
  @ViewChild(WorkflowComponent) myWorkflow: WorkflowComponent;
  constructor(private dockstoreService: DockstoreService,
              private myworkflowService: MyWorkflowsService,
              private userService: UserService,
              private communicatorService: CommunicatorService,
              private workflowobjService: WorkflowObjService) {
    userService.getUser().subscribe(user => {
      this.user = user;
      userService.getUserWorkflowList(user.id).subscribe(workflows => {
        this.orgWorkflows = this.myworkflowService.sortORGWorkflows(workflows, user.username);
        this.workflowobjService.updateWorkflow(this.orgWorkflows[0].workflows[0]);
        this.communicatorService.setWorkflow(this.orgWorkflows[0].workflows[0]);
        this.workflowobjService.workflowName$.subscribe(
          name => {
            this.userWorkflows.push(`${name} confirmed the mission`);
          });
        workflowobjService.hi$.subscribe(
          hi => {
            this.hi = hi;
          });
      });
    });
  }
  updateWorkflow(workflow) {
    this.workflowobjService.updateName(workflow.repository);
    this.workflowobjService.updateWorkflow(workflow);
  }
}
