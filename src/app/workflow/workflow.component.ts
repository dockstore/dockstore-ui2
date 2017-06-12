import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';

import { DockstoreService } from '../shared/dockstore.service';
import { ProviderService } from '../shared/provider.service';
import { WorkflowObjService } from '../shared/workflow.service';
import { ToolObservableService } from '../shared/tool-observable.service';

import { Tool } from '../shared/tool';

import { ToolService } from '../shared/tool.service';
import { UserService } from '../loginComponents/user.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Tool implements OnDestroy {
  labels: string[];

  constructor(private dockstoreService: DockstoreService,
              private dateService: DateService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              userService: UserService,
              router: Router,
              workflowObjService: WorkflowObjService,
              toolObservableService: ToolObservableService) {
    super(toolService, communicatorService, providerService, userService, router,
          workflowObjService, toolObservableService, 'workflows');
  }
  setProperties() {
    const workflowRef = this.workflow;
    this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
    workflowRef.agoMessage = this.dateService.getAgoMessage(workflowRef.last_modified);
  }
  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
  }

  ngOnDestroy() {
  }
}
