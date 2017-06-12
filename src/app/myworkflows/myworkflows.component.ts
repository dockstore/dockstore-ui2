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
  orgWorkflows = [];
  oneAtATime = true;
  constructor(private myworkflowService: MyWorkflowsService,
              private userService: UserService,
              private communicatorService: CommunicatorService,
              private workflowobjService: WorkflowObjService) {
    userService.getUser().subscribe(user => {
      userService.getUserWorkflowList(user.id).subscribe(workflows => {
        this.orgWorkflows = this.myworkflowService.sortORGWorkflows(workflows, user.username);
        const theFirstWorkflow = this.orgWorkflows[0].workflows[0];
        this.selectWorkflow(theFirstWorkflow);
        this.communicatorService.setWorkflow(theFirstWorkflow);
      });
    });
  }
  selectWorkflow(workflow) {
    this.workflowobjService.setWorkflow(workflow);
  }
}
