import {Component, OnInit} from '@angular/core';

import {CommunicatorService} from '../shared/communicator.service';
import {DockstoreService} from '../shared/dockstore.service';
import {ProviderService} from '../shared/provider.service';
import {WorkflowService} from '../shared/workflow.service';

import {MyWorkflowsService} from './myworkflows.service';
import {UserService} from '../loginComponents/user.service';



@Component({
  selector: 'app-myworkflows',
  templateUrl: './myworkflows.component.html',
  styleUrls: ['./myworkflows.component.css'],
  providers: [MyWorkflowsService, ProviderService,
              DockstoreService, CommunicatorService, WorkflowService]
})
export class MyWorkflowsComponent implements OnInit {
  orgWorkflows = [];
  oneAtATime = true;
  selWorkflowObj: any;
  constructor(private myworkflowService: MyWorkflowsService,
              private userService: UserService,
              private communicatorService: CommunicatorService,
              private workflowService: WorkflowService) {

  }
  ngOnInit() {
    this.userService.getUser().subscribe(user => {
      this.userService.getUserWorkflowList(user.id).subscribe(workflows => {
        this.orgWorkflows = this.myworkflowService.sortORGWorkflows(workflows, user.username);
        if (this.orgWorkflows && this.orgWorkflows.length > 0) {
          const theFirstWorkflow = this.orgWorkflows[0].workflows[0];
          this.selectWorkflow(theFirstWorkflow);
          this.communicatorService.setWorkflow(theFirstWorkflow);
        }
      });
    });
  }
  selectWorkflow(workflow) {
    this.selWorkflowObj = workflow;
    this.workflowService.setWorkflow(workflow);
  }
}
