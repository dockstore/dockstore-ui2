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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListContainersService } from '../containers/list/list.service';
import { AddEntryComponent } from '../organizations/collection/add-entry/add-entry.component';
import { AlertQuery } from '../shared/alert/state/alert.query';
import { AlertService } from '../shared/alert/state/alert.service';
import { includesValidation } from '../shared/constants';
import { ContainerService } from '../shared/container.service';
import { DateService } from '../shared/date.service';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { ExtendedDockstoreToolQuery } from '../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { ProviderService } from '../shared/provider.service';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { ToolQuery } from '../shared/tool/tool.query';
import { TrackLoginService } from '../shared/track-login.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
import { RefreshService } from './../shared/refresh.service';
import { ContainersService } from './../shared/swagger/api/containers.service';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
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
  public tool: DockstoreTool;
  public toolCopyBtn: string;
  public sortedVersions: Array<Tag | WorkflowVersion> = [];
  public DockstoreToolType = DockstoreTool;
  validTabs = ['info', 'launch', 'versions', 'files'];
  separatorKeysCodes = [ENTER, COMMA];
  public schema;
  publishMessage = 'Publish the tool to make it visible to the public';
  unpublishMessage = 'Unpublish the tool to remove it from the public';
  viewPublicMessage = 'Go to the public page for this tool';
  pubUnpubMessage: string;
  public extendedTool$: Observable<ExtendedDockstoreTool>;
  public isRefreshing$: Observable<boolean>;

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
    providerService: ProviderService,
    router: Router,
    private containerService: ContainerService,
    location: Location,
    activatedRoute: ActivatedRoute, protected sessionService: SessionService, protected sessionQuery: SessionQuery,
    protected gA4GHFilesService: GA4GHFilesService, private toolQuery: ToolQuery, private alertService: AlertService,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery, private alertQuery: AlertQuery, public dialog: MatDialog) {
    super(trackLoginService, providerService, router, dateService, urlResolverService, activatedRoute,
      location, sessionService, sessionQuery, gA4GHFilesService);
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.extendedTool$ = this.extendedDockstoreToolQuery.extendedDockstoreTool$;

    this._toolType = 'containers';
    this.redirectAndCallDiscourse('/my-tools');
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
    if (this.selectedVersion === null) {
      this.dockerPullCmd = null;
    } else {
      this.dockerPullCmd = this.listContainersService.getDockerPullCmd(this.tool.tool_path, this.selectedVersion.name);
    }
    this.privateOnlyRegistry = this.imageProviderService.checkPrivateOnlyRegistry(this.tool);
    this.shareURL = window.location.href;
    this.labelsEditMode = false;
    this.resetContainerEditData();
    // messy prototype for a carousel https://developers.google.com/search/docs/guides/mark-up-listings
    // will need to be aggregated with a summary page
    this.schema = {
      '@type': 'ListItem',
      'position': this.tool.id,
      'url': this.shareURL
    };
  }

  public subscriptions(): void {
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      tool => {
        this.tool = tool;
        if (tool) {
          this.published = this.tool.is_published;
          this.setPublishMessage();
          if (this.tool.tags.length === 0) {
            this.selectedVersion = null;
          } else {
            this.selectedVersion = this.selectVersion(this.tool.tags, this.urlVersion, this.tool.defaultVersion);
          }
        }
        // Select version
        this.setUpTool(tool);
      }
    );
    this.containerService.copyBtn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      toolCopyBtn => {
        this.toolCopyBtn = toolCopyBtn;
      }
    );
  }

  protected setUpTool(tool: ExtendedDockstoreTool) {
    if (tool) {
      this.tool = tool;
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
      this.containersService.getPublishedContainerByToolPath(this.title, includesValidation)
        .subscribe(tool => {
          this.containerService.setTool(tool);
          this.selectedVersion = this.selectVersion(this.tool.tags, this.urlVersion, this.tool.defaultVersion);

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
      const message = this.published ? 'Publishing workflow' : 'Unpublishing workflow';
      this.alertService.start(message);
      this.containersService.publish(this.tool.id, request).subscribe(
        response => {
          this.containerService.upsertToolToTools(response);
          this.containerService.setTool(response);
          this.setPublishMessage();
          this.alertService.detailedSuccess();
        }, (error: HttpErrorResponse) => {
          this.published = !this.published;
          this.alertService.detailedError(error);
        });
    }
  }

  publishDisable(): boolean {
    return !this.isContainerValid();
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
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

  setPublishMessage() {
    this.pubUnpubMessage = this.published ? this.unpublishMessage : this.publishMessage;
  }

  resetContainerEditData() {
    const labelArray = this.dockstoreService.getLabelStrings(this.tool.labels);
    const toolLabels = labelArray;
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
    return this.containersService.updateLabels(this.tool.id, this.containerEditData.labels.join(', ')).
      subscribe(
        tool => {
          this.tool.labels = tool.labels;
          this.updateContainer.setTool(tool);
          this.labelsEditMode = false;
        });
  }

  cancelLabelChanges(): void {
    this.containerEditData.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    this.labelsEditMode = false;
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
    if (this.selectVersion) {
      this.gA4GHFilesService.updateFiles(this.tool.path, this.selectedVersion.name);
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

  getPageIndex(): number {
    let pageIndex = this.getIndexInURL('/containers');
    if (pageIndex === -1) {
      pageIndex = this.getIndexInURL('/tools');
      this.switchToolsToContainers();
    }
    return pageIndex;
  }

  addToLabels(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.containerEditData.labels.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeLabel(label: any): void {
    const index = this.containerEditData.labels.indexOf(label);

    if (index >= 0) {
      this.containerEditData.labels.splice(index, 1);
    }
  }

  isHosted(): boolean {
    if (this.tool) {
      return this.tool.mode === DockstoreTool.ModeEnum.HOSTED;
    } else {
      return true;
    }
  }

  addEntryToCollection() {
    this.dialog.open(AddEntryComponent, {
      data: { entryId: this.tool.id }, width: '500px'
    });
  }
}
