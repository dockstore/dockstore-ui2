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
import { AfterViewInit, Component } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ListContainersService } from '../containers/list/list.service';
import { AlertQuery } from '../shared/alert/state/alert.query';
import { BioschemaService } from '../shared/bioschema.service';
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
import { ToolService } from '../shared/tool/tool.service';
import { TrackLoginService } from '../shared/track-login.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
import { ContainersService } from './../shared/swagger/api/containers.service';
import { DockstoreTool } from './../shared/swagger/model/dockstoreTool';
import { UrlResolverService } from './../shared/url-resolver.service';
import { EmailService } from './email.service';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html'
})
export class ContainerComponent extends Entry implements AfterViewInit {
  dockerPullCmd: string;
  privateOnlyRegistry: boolean;
  containerEditData: any;
  thisisValid = true;
  ModeEnum = DockstoreTool.ModeEnum;
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
  public extendedTool$: Observable<ExtendedDockstoreTool>;
  public isRefreshing$: Observable<boolean>;
  constructor(
    private dockstoreService: DockstoreService,
    dateService: DateService,
    bioschemaService: BioschemaService,
    urlResolverService: UrlResolverService,
    private imageProviderService: ImageProviderService,
    private listContainersService: ListContainersService,
    private updateContainer: ContainerService,
    private containersService: ContainersService,
    private emailService: EmailService,
    trackLoginService: TrackLoginService,
    providerService: ProviderService,
    router: Router,
    private containerService: ContainerService,
    location: Location,
    activatedRoute: ActivatedRoute,
    protected sessionService: SessionService,
    protected sessionQuery: SessionQuery,
    protected gA4GHFilesService: GA4GHFilesService,
    private toolQuery: ToolQuery,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery,
    private alertQuery: AlertQuery,
    public dialog: MatDialog,
    private toolService: ToolService,
    private alertService: AlertService
  ) {
    super(
      trackLoginService,
      providerService,
      router,
      dateService,
      bioschemaService,
      urlResolverService,
      activatedRoute,
      location,
      sessionService,
      sessionQuery,
      gA4GHFilesService
    );
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.extendedTool$ = this.extendedDockstoreToolQuery.extendedDockstoreTool$;
    this._toolType = 'containers';
    this.redirectToCanonicalURL('/my-tools');
  }

  ngAfterViewInit() {
    if (this.publicPage) {
      this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
        if (tool && tool.topicId) {
          this.discourseHelper(tool.topicId);
        }
      });
    }

    this.updateTabSelection();
  }

  clearState() {
    this.toolService.clearActive();
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
    this.schema = this.bioschemaService.getToolSchema(this.tool, this.selectedVersion);
  }

  public subscriptions(): void {
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.published = this.tool.is_published;
        if (this.tool.workflowVersions.length === 0) {
          this.selectedVersion = null;
        } else {
          this.selectedVersion = this.selectTag(this.tool.workflowVersions, this.urlVersion, this.tool.defaultVersion);
        }
      }
      // Select version
      this.setUpTool(tool);
    });
    this.containerService.copyBtn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(toolCopyBtn => {
      this.toolCopyBtn = toolCopyBtn;
    });
  }

  protected setUpTool(tool: ExtendedDockstoreTool) {
    if (tool) {
      this.tool = tool;
      this.initTool();
      this.contactAuthorHREF = this.emailService.composeContactAuthorEmail(this.tool);
      this.requestAccessHREF = this.emailService.composeRequestAccessEmail(this.tool);
      this.sortedVersions = this.getSortedTags(this.tool.workflowVersions, this.defaultVersion);
    }
  }

  public setupPublicEntry(url: String) {
    if (url.includes('containers') || url.includes('tools')) {
      // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.containersService.getPublishedContainerByToolPath(this.title, includesValidation).subscribe(
        tool => {
          this.containerService.setTool(tool);
          this.selectedVersion = this.selectTag(this.tool.workflowVersions, this.urlVersion, this.tool.defaultVersion);

          this.selectTab(this.validTabs.indexOf(this.currentTab));
          if (this.tool != null) {
            this.updateUrl(this.tool.tool_path, 'my-tools', 'containers');
          }
        },
        error => {
          this.router.navigate(['../']);
        }
      );
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.workflowVersions);
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

  // TODO: Move most of this function to the service, sadly 'this.labelsEditMode' makes it more difficult
  setContainerLabels() {
    this.alertService.start('Setting labels');
    return this.containersService.updateLabels(this.tool.id, this.containerEditData.labels.join(', ')).subscribe(
      tool => {
        this.updateContainer.setTool(tool);
        this.labelsEditMode = false;
        this.alertService.simpleSuccess();
      },
      error => {
        this.alertService.detailedError(error);
      }
    );
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
    this.schema = this.bioschemaService.getToolSchema(this.tool, this.selectedVersion);
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
}
