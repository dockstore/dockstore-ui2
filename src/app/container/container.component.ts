/**
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { ListContainersService } from '../containers/list/list.service';
import { CommunicatorService } from '../shared/communicator.service';
import { ContainerService } from '../shared/container.service';
import { DateService } from '../shared/date.service';
import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { ErrorService } from './../shared/error.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
import { RefreshService } from './../shared/refresh.service';
import { StateService } from './../shared/state.service';
import { ContainersService } from './../shared/swagger/api/containers.service';
import { PublishRequest } from './../shared/swagger/model/publishRequest';
import { UrlResolverService } from './../shared/url-resolver.service';
import { EmailService } from './email.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
})
export class ContainerComponent extends Entry {
  dockerPullCmd: string;
  privateOnlyRegistry: boolean;
  containerEditData: any;
  thisisValid = true;
  public requestAccessHREF: string;
  public contactAuthorHREF: string;
  public missingWarning: boolean;
  public tool: ExtendedDockstoreTool;
  private toolSubscription: Subscription;
  private toolCopyBtnSubscription: Subscription;
  public toolCopyBtn: string;
  public sortedVersions: Array<Tag|WorkflowVersion> = [];
  validTabs = ['info', 'labels', 'versions', 'files'];
  constructor(private dockstoreService: DockstoreService,
    dateService: DateService,
    urlResolverService: UrlResolverService,
    private imageProviderService: ImageProviderService,
    private listContainersService: ListContainersService,
    private refreshService: RefreshService,
    private updateContainer: ContainerService,
    private containersService: ContainersService,
    private emailService: EmailService,
    trackLoginService: TrackLoginService,
    communicatorService: CommunicatorService,
    providerService: ProviderService,
    router: Router,
    private containerService: ContainerService,
    stateService: StateService,
    errorService: ErrorService,
    location: Location,
    activatedRoute: ActivatedRoute) {
    super(trackLoginService, providerService, router,
      stateService, errorService, dateService, urlResolverService, activatedRoute, location);
    this._toolType = 'containers';

    let trimmedURL = window.location.href;

    // Change /tools or /containers
    let pageIndex = window.location.href.indexOf('/containers');
    if (pageIndex == -1) {
      pageIndex = window.location.href.indexOf('/tools');
      this.switchToolsToContainers();
    }

    // Decode the URL
    this.decodeURL();

    const indexOfLastColon = window.location.href.indexOf(':', pageIndex);
    if (indexOfLastColon > 0) {
      trimmedURL = window.location.href.substring(0, indexOfLastColon);
    }

    // Initialize discourse urls
    (<any>window).DiscourseEmbed = {
      discourseUrl: Dockstore.DISCOURSE_URL,
      discourseEmbedUrl: decodeURIComponent(trimmedURL)
    };
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

  /**
   * Populate the extra ExtendedDockstoreTool properties
   */
  setProperties() {
    let toolRef: ExtendedDockstoreTool = this.tool;
    this.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    if (this.selectedVersion === null) {
      this.dockerPullCmd = null;
    } else {
      this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.tool_path, this.selectedVersion.name);
    }
    this.privateOnlyRegistry = this.imageProviderService.checkPrivateOnlyRegistry(this.tool);
    this.shareURL = window.location.href;
    this.labelsEditMode = false;
    toolRef.agoMessage = this.dateService.getAgoMessage(new Date(this.tool.lastBuild).getTime());
    toolRef.email = this.dockstoreService.stripMailTo(this.tool.email);
    toolRef.lastBuildDate = this.dateService.getDateTimeMessage(new Date(this.tool.lastBuild).getTime());
    toolRef.lastUpdatedDate = this.dateService.getDateTimeMessage(new Date(this.tool.lastBuild).getTime());
    toolRef.versionVerified = this.dockstoreService.getVersionVerified(toolRef.tags);
    toolRef.verifiedSources = this.dockstoreService.getVerifiedSources(toolRef);
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
          if (this.tool.tags.length === 0) {
            this.selectedVersion = null;
          } else {
            this.selectedVersion = this.selectVersion(this.tool.tags, this.urlVersion, this.tool.defaultVersion, this.selectedVersion);
          }
        }
        // Select version
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

  protected setUpTool(tool: ExtendedDockstoreTool) {
    if (tool) {
      this.tool = tool;
      if (!tool.providerUrl) {
        this.providerService.setUpProvider(tool);
      }
      this.tool = Object.assign(tool, this.tool);
      const toolRef: ExtendedDockstoreTool = this.tool;
      toolRef.buildMode = this.containerService.getBuildMode(toolRef.mode);
      toolRef.buildModeTooltip = this.containerService.getBuildModeTooltip(toolRef.mode);
      this.initTool();
      this.contactAuthorHREF = this.emailService.composeContactAuthorEmail(this.tool);
      this.requestAccessHREF = this.emailService.composeRequestAccessEmail(this.tool);
      this.sortedVersions = this.getSortedVersions(this.tool.tags, this.defaultVersion);
    }
  }

  public setupPublicEntry(url: String) {
    if (url.includes('containers') || url.includes('tools')) {
      // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.containersService.getPublishedContainerByToolPath(this.title)
        .subscribe(tool => {
          this.containerService.setTool(tool);
          this.selectedVersion = this.selectVersion(this.tool.tags, this.urlVersion, this.tool.defaultVersion, this.selectedVersion);

          this.selectTab(this.validTabs.indexOf(this.currentTab));
          if (this.tool != null) {
            this.updateUrl(this.tool.tool_path, 'my-tools', 'containers');
          }
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
        response => {
          this.containerService.upsertToolToTools(response);
        }, err => {
          this.published = !this.published;
          this.refreshService.handleError('publish error', err);
        });
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

  onTagChange(tag: Tag): void {
    this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.tool_path, tag.name);
  }


  /**
   * Called when the selected version is changed
   * @param {Tag} tag - New tag
   * @return {void}
   */
  onSelectedVersionChange(tag: Tag): void {
    this.selectedVersion = tag;
    if (this.tool != null) {
      this.updateUrl(this.tool.tool_path, 'my-tools', 'containers');
    }
    this.onTagChange(tag);
  }

  setEntryTab(tabName: string): void {
     this.currentTab = tabName;
     if (this.tool != null) {
       this.updateUrl(this.tool.tool_path, 'my-tools', 'containers');
     }
   }

   /**
    * Will change the /tools in the current URL with /containers
    * @return {void}
    */
   switchToolsToContainers(): void {
     const url = window.location.href.replace('/tools', '/containers');
     const toolsIndex = window.location.href.indexOf('/tools');
     const newPath = url.substring(toolsIndex);
     this.location.go(newPath);
   }

   /**
    * Will decode the URL
    * @return {void}
    */
   decodeURL(): void {
     const url = decodeURIComponent(window.location.href);
     const containersIndex = window.location.href.indexOf('/containers');
     const newPath = url.substring(containersIndex);
     this.location.go(newPath);
   }

}
