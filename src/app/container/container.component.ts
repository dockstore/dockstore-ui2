import {Component, Input, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';

import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';

import { DockstoreService } from '../shared/dockstore.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';

import { Tool } from '../shared/tool';

import { ToolService } from '../shared/tool.service';
import { ContainerService } from '../shared/container.service';
import { UserService } from '../loginComponents/user.service';
import { WorkflowService } from '../shared/workflow.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
})
export class ContainerComponent extends Tool implements OnDestroy {
  labels: string[];
  labelsEditMode: boolean;
  containerEditData: any;
  constructor(private dockstoreService: DockstoreService,
              private dateService: DateService,
              private imageProviderService: ImageProviderService,
              private containerService2: ContainerService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              userService: UserService,
              router: Router,
              workflowService: WorkflowService,
              containerService: ContainerService) {
    super(toolService, communicatorService, providerService, userService, router,
      workflowService, containerService, 'containers');
  }

  setProperties() {
    let toolRef = this.tool;
    this.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    this.labelsEditMode = false;
    toolRef.agoMessage = this.dateService.getAgoMessage(toolRef.lastBuild);
    toolRef.email = this.dockstoreService.stripMailTo(toolRef.email);
    toolRef.lastBuildDate = this.dateService.getDateTimeMessage(toolRef.lastBuild);
    toolRef.lastUpdatedDate = this.dateService.getDateTimeMessage(toolRef.lastUpdated);
    toolRef.versionVerified = this.dockstoreService.getVersionVerified(toolRef.tags);
    toolRef.verifiedSources = this.dockstoreService.getVerifiedSources(toolRef);
    toolRef.verifiedLinks = this.dateService.getVerifiedLink();
    if (!toolRef.imgProviderUrl) {
      toolRef = this.imageProviderService.setUpImageProvider(toolRef);
    }
    this.resetContainerEditData();
  }
  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }
  toggleLabelsEditMode() {
    this.labelsEditMode = !this.labelsEditMode;
  }
  resetContainerEditData() {
    const labelArray = this.dockstoreService.getLabelStrings(this.tool.labels);
    let toolLabels = '';
    for (let i = 0; i < labelArray.length; i++) {
      toolLabels += labelArray[i] + ((i !== labelArray.length - 1) ? ', ' : '');
    }
    this.containerEditData = {
      labels: toolLabels,
      is_published: this.tool.is_published
    };
  }

  submitContainerEdits() {
    console.log('hi');
    if (!this.labelsEditMode) {
      this.labelsEditMode = true;
      return;
    }
    // the edit object should be recreated
    if (this.containerEditData.labels) {
      this.setContainerLabels();
    }
  }
  setContainerLabels(): any {
    return this.dockstoreService.setContainerLabels(this.tool.id, this.containerEditData.labels).
    subscribe(
      tool => {
        this.tool.labels = tool.labels;
        this.containerService2.setTool(tool);
        this.labelsEditMode = false;
      }
    );
  }
}
