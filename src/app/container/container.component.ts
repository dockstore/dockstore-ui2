import { EmailService } from './email.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
/*
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

import { ErrorService } from './../shared/error.service';
import { PublishRequest } from './../shared/swagger/model/publishRequest';
import { Subscription } from 'rxjs/Subscription';
import { ContainersService } from './../shared/swagger/api/containers.service';
import { StateService } from './../shared/state.service';
import { RefreshService } from './../shared/refresh.service';
import { FormsModule } from '@angular/forms';
import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Dockstore } from '../shared/dockstore.model';

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
import { Tag } from '../shared/swagger/model/tag';



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
  public selectedVersion = null;
  public urlTag = null;
  constructor(private dockstoreService: DockstoreService,
    dateService: DateService,
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
    errorService: ErrorService) {
    super(trackLoginService, providerService, router,
      stateService, errorService, dateService);
    this._toolType = 'containers';

    // Initialize discourse urls
    (<any>window).DiscourseEmbed = {
      discourseUrl: Dockstore.DISCOURSE_URL,
      discourseEmbedUrl: decodeURIComponent(window.location.href)
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

  setProperties() {
    let toolRef: ExtendedDockstoreTool = this.tool;
    this.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.path, this.selectedVersion.name);
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
          this.selectedVersion = this.selectVersion(this.tool.tags, this.urlTag, this.tool.defaultVersion, this.selectedVersion);
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
    }
  }

  public setupPublicEntry(url: String) {
    if (url.includes('containers')) {
      this.title = this.decodedString(url.replace(`/${this._toolType}/`, ''));

      // Get version from path if it exists
      const splitTitle = this.title.split(':');

      if (splitTitle.length === 2) {
        this.urlTag = splitTitle[1];
        this.title = this.title.replace(':' + this.urlTag, '');
      }

      // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.containersService.getPublishedContainerByToolPath(this.title, this._toolType)
        .subscribe(tool => {
          this.containerService.setTool(tool);
          this.selectedVersion = this.selectVersion(this.tool.tags, this.urlTag, this.tool.defaultVersion, this.selectedVersion);

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
        response => this.tool.is_published = response.is_published, err => {
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
    this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.path, tag.name);
  }

  onSelectedVersionChange(tag: Tag): void {
    this.selectedVersion = tag;
    this.onTagChange(tag);
  }

  getSortedVersions(versions: Array<Tag>): Array<Tag> {
    // Get top six versions and have default at front
    let sortedVersions: Array<Tag> = [];
    const finalVersions: Array<Tag> = [];
    let counter = 0;

    // Sort versions by last_modified date
    sortedVersions = versions.sort((a, b) => a.last_modified > b.last_modified ? -1 : a.last_modified < b.last_modified ? 1 : 0);

    // The default version will appear first
    finalVersions.push(this.defaultVersion);

    // Grab the top 5 versions, ignoring the default version
    for (const version of sortedVersions) {
      if (version !== this.defaultVersion) {
        finalVersions.push(version);
      }
      if (counter === 5) {
        break;
      }
      counter++;
    }

    return finalVersions;
  }

}
