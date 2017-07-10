import { ContainersWebService } from './../shared/webservice/containers-web.service';
import { StateService } from './../shared/state.service';
import { RefreshService } from './../shared/refresh.service';
import { FormsModule } from '@angular/forms';
import { PublishRequest } from './../shared/models/PublishRequest';
import { Component, Input, OnDestroy } from '@angular/core';
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
import { TrackLoginService } from '../shared/track-login.service';


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
  containerEditData: any;
  thisisValid = true;
  labelPattern = validationPatterns.label;
  starGazersClicked = false;
  constructor(private dockstoreService: DockstoreService,
    private dateService: DateService,
    private imageProviderService: ImageProviderService,
    private listContainersService: ListContainersService,
    private refreshService: RefreshService,
    private updateContainer: ContainerService,
    private containerWebService: ContainersWebService,
    trackLoginService: TrackLoginService,
    toolService: ToolService,
    communicatorService: CommunicatorService,
    providerService: ProviderService,
    router: Router,
    workflowService: WorkflowService,
    containerService: ContainerService,
    stateService: StateService) {
    super(trackLoginService, toolService, communicatorService, providerService, router,
      workflowService, containerService, stateService, 'containers');
  }
  starGazersChange() {
    this.starGazersClicked = !this.starGazersClicked;
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
    if (!toolRef.imgProviderUrl) {
      toolRef = this.imageProviderService.setUpImageProvider(toolRef);
    }
    this.resetContainerEditData();
  }
  sumCounts(count) {
    this.totalShare += count;
  }

  publishTool() {
    if (this.publishDisable()) {
      return;
    } else {
      const request: PublishRequest = new PublishRequest;
      request.publish = this.published;
      this.containerWebService.publish(this.tool.id, request).subscribe(
        response => this.tool.is_published = response.is_published, err => this.published = !this.published);
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }

  publishDisable() {
    return this.refreshing || !this.isContainerValid();
  }

  isContainerValid() {
    if (!this.tool) {
      return false;
    }
    if (this.tool.is_published) {
      return true;
    }

    const versionTags = this.tool.tags;

    if (versionTags === null) {
      return false;
    }

    for (let i = 0; i < versionTags.length; i++) {
      if (versionTags[i].valid) {
        return true;
      }
    }
    return false;
  };

  refresh() {
    this.refreshService.refreshContainer();
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
