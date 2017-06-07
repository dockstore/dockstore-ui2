import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';

import { DockstoreService } from '../shared/dockstore.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';

import { Tool } from '../shared/tool';

import { ToolService } from '../shared/tool.service';
import { UserService } from '../loginComponents/user.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Tool {
  labels: string[];
  constructor(private dockstoreService: DockstoreService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              userService: UserService,
              router: Router) {
    super(toolService, communicatorService, providerService, userService, router, 'workflows');
  }
  setProperties() {
    const workflowRef = this.workflow;
    this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
  }
  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
  }
}
