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
import { WorkflowService } from '../shared/workflow.service';
import { ListContainersService } from '../containers/list/list.service';
import { validationPatterns } from '../shared/validationMessages.model';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
})
export class ContainerComponent extends Tool {
  labels: string[];
  dockerPullCmd: string;
  privateOnlyRegistry: boolean;
  totalShare = 0;
  shareURL: string;
  labelsEditMode: boolean;
  containerEditData: any;
  labelPattern = validationPatterns.label;
  constructor(private dockstoreService: DockstoreService,
              private dateService: DateService,
              private imageProviderService: ImageProviderService,
              private listContainersService: ListContainersService,
              private updateContainer: ContainerService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              router: Router,
              workflowService: WorkflowService,
              containerService: ContainerService) {
    super(toolService, communicatorService, providerService, router,
          workflowService, containerService, 'containers');
  }

  setProperties() {
    let toolRef = this.tool;
    this.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.path);
    this.privateOnlyRegistry = this.imageProviderService.checkPrivateOnlyRegistry(this.tool);
    this.shareURL = window.location.href;
    this.labelsEditMode = false;
    toolRef.agoMessage = this.dateService.getAgoMessage(toolRef.lastBuild);
    toolRef.email = this.dockstoreService.stripMailTo(toolRef.email);
    toolRef.lastBuildDate = this.dateService.getDateTimeMessage(toolRef.lastBuild);
    toolRef.lastUpdatedDate = this.dateService.getDateTimeMessage(toolRef.lastUpdated);
    toolRef.versionVerified = this.dockstoreService.getVersionVerified(toolRef.tags);
    toolRef.verifiedSources = this.dockstoreService.getVerifiedSources(toolRef);
    toolRef.verifiedLinks = this.dateService.getVerifiedLink();
    toolRef.isPublic = this.isToolPublic;
    if (!toolRef.imgProviderUrl) {
      toolRef = this.imageProviderService.setUpImageProvider(toolRef);
    }
    this.resetContainerEditData();
  }
  sumCounts(count) {
    this.totalShare += count;
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }
  toggleLabelsEditMode() {
    this.labelsEditMode = !this.labelsEditMode;
  }
  resetContainerEditData() {
    const labelArray = this.dockstoreService.getLabelStrings(this.tool.labels);
    const toolLabels = labelArray.join(', ');
    this.containerEditData = {
      labels: toolLabels,
      is_published: this.tool.is_published
    };
  }

  submitContainerEdits() {
    if (!this.labelsEditMode) {
      this.labelsEditMode = true;
      return;
    }
    // the edit object should be recreated
    if (this.containerEditData.labels !== 'undefined') {
      this.setContainerLabels();
    }
  }
  setContainerLabels(): any {
    return this.dockstoreService.setContainerLabels(this.tool.id, this.containerEditData.labels).
    subscribe(
      tool => {
        this.tool.labels = tool.labels;
        this.updateContainer.setTool(tool);
        this.labelsEditMode = false;
      }
    );
  }
}
