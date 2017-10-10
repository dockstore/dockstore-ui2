import { ErrorService } from './../shared/error.service';
import { PublishRequest } from './../shared/swagger/model/publishRequest';
import { Subscription } from 'rxjs/Subscription';
import { ContainersService } from './../shared/swagger/api/containers.service';
import { StateService } from './../shared/state.service';
import { RefreshService } from './../shared/refresh.service';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';

import { DockstoreService } from '../shared/dockstore.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';

import { Entry } from '../shared/entry';

import { ContainerService } from '../shared/container.service';
import { ListContainersService } from '../containers/list/list.service';
import { validationPatterns } from '../shared/validationMessages.model';
import { TrackLoginService } from '../shared/track-login.service';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
})
export class ContainerComponent extends Entry {
  dockerPullCmd: string;
  privateOnlyRegistry: boolean;
  containerEditData: any;
  thisisValid = true;
  public missingWarning: boolean;
  public tool;
  private toolSubscription: Subscription;
  private toolCopyBtnSubscription: Subscription;
  public toolCopyBtn: string;
  constructor(private dockstoreService: DockstoreService,
    private dateService: DateService,
    private imageProviderService: ImageProviderService,
    private listContainersService: ListContainersService,
    private refreshService: RefreshService,
    private updateContainer: ContainerService,
    private containersService: ContainersService,
    trackLoginService: TrackLoginService,
    communicatorService: CommunicatorService,
    providerService: ProviderService,
    router: Router,
    private containerService: ContainerService,
    stateService: StateService,
    errorService: ErrorService) {
    super(trackLoginService, providerService, router,
      stateService, errorService);
    this._toolType = 'containers';
  }

  public getDefaultVersionName(): string {
    return this.tool.defaultVersion;
  }

  isPublic(): boolean {
    return this.isToolPublic;
  }

  public resetCopyBtn(): void {
    this.containerService.setCopyBtn(null);
  }

  setProperties() {
    let toolRef: any = this.tool;
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

  public subscriptions(): void {
    this.toolSubscription = this.containerService.tool$.subscribe(
      tool => {
        this.tool = tool;
        if (tool) {
          this.published = this.tool.is_published;
        }
        this.setUpTool(tool);
      }
    );
    this.toolCopyBtnSubscription = this.containerService.copyBtn$.subscribe(
      toolCopyBtn => {
        this.toolCopyBtn = toolCopyBtn;
      }
    );
  }

  onDestroy(): void {
    this.toolSubscription.unsubscribe();
    this.toolCopyBtnSubscription.unsubscribe();
  }

  protected setUpTool(tool: any) {
    if (tool) {
      this.tool = tool;
      if (!tool.providerUrl) {
        this.providerService.setUpProvider(tool);
      }
      this.tool = Object.assign(tool, this.tool);
      const toolRef: any = this.tool;
      toolRef.buildMode = this.containerService.getBuildMode(toolRef.mode);
      toolRef.buildModeTooltip = this.containerService.getBuildModeTooltip(toolRef.mode);
      this.initTool();
    }
  }

  public setupPublicEntry(url: String) {
    if (url.includes('containers')) {
      this.title = this.decodedString(url.replace(`/${this._toolType}/`, ''));
      // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.containersService.getPublishedContainerByToolPath(this.title, this._toolType)
        .subscribe(tool => {
          this.containerService.setTool(tool);
        }, error => {
          this.router.navigate(['../']);
        });
    }
  }

  publish() {
    if (this.publishDisable()) {
      return;
    } else {
      const request: PublishRequest = {
        publish: this.published
      };
      this.containersService.publish(this.tool.id, request).subscribe(
        response => this.tool.is_published = response.is_published, err => this.published = !this.published);
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }

  publishDisable() {
    return this.refreshMessage !== null || !this.isContainerValid();
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
  }

  refresh() {
    this.refreshService.refreshTool();
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
    return this.containersService.updateLabels(this.tool.id, this.containerEditData.labels).
      subscribe(
      tool => {
        this.tool.labels = tool.labels;
        this.updateContainer.setTool(tool);
        this.labelsEditMode = false;
      });
  }

  public toolCopyBtnClick(copyBtn): void {
    this.containerService.setCopyBtn(copyBtn);
  }

}
