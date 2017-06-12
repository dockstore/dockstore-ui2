import { Component } from '@angular/core';

import {CommunicatorService} from '../shared/communicator.service';
import {DockstoreService} from '../shared/dockstore.service';
import {ProviderService} from '../shared/provider.service';
import {WorkflowObservableService} from '../shared/workflow-observable.service';

import {MyWorkflowsService} from './myworkflows.service';
import {UserService} from '../loginComponents/user.service';



@Component({
  selector: 'app-myworkflows',
  templateUrl: './myworkflows.component.html',
  styleUrls: ['./myworkflows.component.css'],
  providers: [MyWorkflowsService, ProviderService,
              DockstoreService, CommunicatorService, WorkflowObservableService]
})
export class MyWorkflowsComponent {
  orgWorkflows = [];
  oneAtATime = true;
  constructor(private myworkflowService: MyWorkflowsService,
              private userService: UserService,
              private communicatorService: CommunicatorService,
              private workflowobjService: WorkflowObservableService) {
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
