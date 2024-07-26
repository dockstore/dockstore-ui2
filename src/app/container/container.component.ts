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
import { Location, NgIf, NgFor, NgClass, AsyncPipe, DatePipe } from '@angular/common';
import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { MatLegacyChipInputEvent as MatChipInputEvent, MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ListContainersService } from '../containers/list/list.service';
import { AlertQuery } from '../shared/alert/state/alert.query';
import { BioschemaService, BioschemaTool } from '../shared/bioschema.service';
import { includesValidation } from '../shared/constants';
import { ContainerService } from '../shared/container.service';
import { DateService } from '../shared/date.service';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { ExtendedDockstoreToolQuery } from '../shared/extended-dockstoreTool/extended-dockstoreTool.query';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { ImageProviderService } from '../shared/image-provider.service';
import { EntriesService, Tag } from '../shared/openapi';
import { ProviderService } from '../shared/provider.service';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { ToolQuery } from '../shared/tool/tool.query';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { ToolService } from '../shared/tool/tool.service';
import { TrackLoginService } from '../shared/track-login.service';
import { ExtendedDockstoreTool } from './../shared/models/ExtendedDockstoreTool';
import { ContainersService } from './../shared/openapi/api/containers.service';
import { DockstoreTool } from './../shared/openapi/model/dockstoreTool';
import { UrlResolverService } from './../shared/url-resolver.service';
import { AddTagComponent } from './add-tag/add-tag.component';
import { EmailService } from './email.service';
import { EntryCategoriesService } from '../categories/state/entry-categories.service';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { VerifiedByComponent } from '../shared/entry/verified-by/verified-by.component';
import { CurrentCollectionsComponent } from '../entry/current-collections/current-collections.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { SnackbarDirective } from '../shared/snackbar.directive';
import { MatDividerModule } from '@angular/material/divider';
import { ToolFileEditorComponent } from './tool-file-editor/tool-file-editor.component';
import { FilesContainerComponent } from './files/files.component';
import { VersionsContainerComponent } from './versions/versions.component';
import { LaunchComponent } from './launch/launch.component';
import { InfoTabComponent } from './info-tab/info-tab.component';
import { MatLegacyTabsModule } from '@angular/material/legacy-tabs';
import { StargazersComponent } from '../stargazers/stargazers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryButtonComponent } from '../categories/button/category-button.component';
import { ToolActionsComponent } from '../shared/entry-actions/tool-actions.component';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { StarringComponent } from '../starring/starring.component';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { PrivateIconComponent } from '../shared/private-icon/private-icon.component';
import { JsonLdComponent } from '../shared/json-ld/json-ld.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { WorkflowComponent } from '../workflow/workflow.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['../shared/styles/workflow-container.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    WorkflowComponent,
    MatLegacyCardModule,
    MatIconModule,
    FlexModule,
    JsonLdComponent,
    PrivateIconComponent,
    ExtendedModule,
    MatLegacyChipsModule,
    MatLegacyTooltipModule,
    MatLegacyFormFieldModule,
    MatLegacySelectModule,
    NgFor,
    MatLegacyOptionModule,
    StarringComponent,
    MatLegacyButtonModule,
    ToolActionsComponent,
    CategoryButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    StargazersComponent,
    NgClass,
    MatLegacyTabsModule,
    InfoTabComponent,
    LaunchComponent,
    VersionsContainerComponent,
    FilesContainerComponent,
    ToolFileEditorComponent,
    MatDividerModule,
    SnackbarDirective,
    ClipboardModule,
    CurrentCollectionsComponent,
    VerifiedByComponent,
    ShareButtonsModule,
    AsyncPipe,
    DatePipe,
  ],
})
export class ContainerComponent extends Entry<Tag> implements AfterViewInit, OnInit {
  dockerPullCmd: string;
  privateOnlyRegistry: boolean;
  containerEditData: any;
  thisisValid = true;
  ModeEnum = DockstoreTool.ModeEnum;
  public requestAccessHREF$: Observable<string>;
  public contactAuthorHREF: string;
  public tool: DockstoreTool;
  public toolCopyBtn: string;
  public sortedVersions: Array<Tag> = [];
  public DockstoreToolType = DockstoreTool;
  public isManualMode$: Observable<boolean>;
  public displayAppTool: boolean = false;
  validTabs = ['info', 'launch', 'versions', 'files'];
  separatorKeysCodes = [ENTER, COMMA];
  public schema: BioschemaTool;
  public extendedTool$: Observable<ExtendedDockstoreTool>;
  public isRefreshing$: Observable<boolean>;
  @Input() selectedVersion: Tag;

  constructor(
    private dockstoreService: DockstoreService,
    dateService: DateService,
    bioschemaService: BioschemaService,
    urlResolverService: UrlResolverService,
    alertService: AlertService,
    entryService: EntriesService,
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
    private workflowQuery: WorkflowQuery,
    private extendedDockstoreToolQuery: ExtendedDockstoreToolQuery,
    private alertQuery: AlertQuery,
    public dialog: MatDialog,
    private toolService: ToolService,
    private titleService: Title,
    protected entryCategoriesService: EntryCategoriesService
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
      gA4GHFilesService,
      alertService,
      entryService,
      entryCategoriesService
    );
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.extendedTool$ = this.extendedDockstoreToolQuery.extendedDockstoreTool$;
    this._toolType = 'containers';
    this.redirectToCanonicalURL('/my-tools');
  }

  ngOnInit() {
    this.init();
  }

  ngAfterViewInit() {
    if (this.publicPage) {
      this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool) => {
        if (tool) {
          const previousTitle = this.titleService.getTitle();
          this.titleService.setTitle(`${previousTitle} | ${tool.tool_path}`);
          if (tool.topicId) {
            this.discourseHelper(tool.topicId);
          }
        }
      });
    }
    this.isManualMode$ = this.toolQuery.isManualMode$;
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

  showAddTagModal() {
    this.dialog.open(AddTagComponent, { width: '600px' });
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
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool) => {
      this.tool = tool;
      if (tool) {
        this.displayAppTool = false;
        this.published = this.tool.is_published;
        if (this.tool.workflowVersions.length === 0) {
          this.selectedVersion = null;
          this.versionsFileTypes = [];
        } else {
          this.selectedVersion = this.selectTag(this.tool.workflowVersions, this.urlVersion, this.tool.defaultVersion);
          if (this.selectedVersion) {
            this.updateVersionsFileTypes(tool.id, this.selectedVersion.id);
          }
        }
      }
      // Select version
      this.setUpTool(tool);
    });
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => {
      if (workflow) {
        this.displayAppTool = true;
        // Here, we don't need to set any other fields, because in the template,
        // we defer to the "workflow" component, which takes care of all that.
      }
    });
    this.containerService.copyBtn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((toolCopyBtn) => {
      this.toolCopyBtn = toolCopyBtn;
    });
  }

  protected setUpTool(tool: ExtendedDockstoreTool) {
    if (tool) {
      this.tool = tool;
      this.initTool();
      this.requestAccessHREF$ = this.extendedTool$.pipe(
        map((extendedTool) => {
          return this.emailService.composeRequestAccessEmail(extendedTool);
        })
      );
      this.contactAuthorHREF = this.emailService.composeContactAuthorEmail(this.tool);
      this.sortedVersions = this.getSortedTags(this.tool.workflowVersions, this.defaultVersion);
      this.updateVerifiedPlatforms(this.tool.id);
      this.updateCategories(this.tool.id, this.tool.is_published);
    }
  }

  /**
   * Select the Versions tab
   *
   * @memberof WorkflowComponent
   */
  public selectVersionsTab() {
    this.selectTab(this.validTabs.indexOf('versions'));
  }

  public setupPublicEntry(url: string) {
    if (url.includes('/containers/github.com') || url.includes('/tools/github.com')) {
      this.containerService.setTool(null);
      this.displayAppTool = true;
    } else if (url.includes('containers') || url.includes('tools')) {
      // Only get published tool if the URI is for a specific tool (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.containerService.setTool(null);
      this.displayAppTool = false;
      this.containersService.getPublishedContainerByToolPath(this.title, includesValidation).subscribe(
        (tool) => {
          this.containerService.setTool(tool);
          this.selectedVersion = this.selectTag(this.tool.workflowVersions, this.urlVersion, this.tool.defaultVersion);

          this.selectTab(this.validTabs.indexOf(this.currentTab));
          if (this.tool != null) {
            this.updateUrl(this.tool.tool_path, 'my-tools', 'containers', this.selectedVersion);
          }
        },
        (error) => {
          if (error.status === 404) {
            this.urlResolverService.showPageNotFound();
          }
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
      is_published: this.tool.is_published,
    };
  }

  submitContainerEdits() {
    if (!this.labelsEditMode) {
      this.labelsEditMode = true;
      return;
    }
    const value = this.labelFormControl.value;
    if ((value || '').trim()) {
      this.containerEditData.labels.push(value.trim());
    }
    // the edit object should be recreated
    if (this.containerEditData.labels !== undefined) {
      this.setContainerLabels();
    }
    this.labelFormControl.setValue(null);
  }

  // TODO: Move most of this function to the service, sadly 'this.labelsEditMode' makes it more difficult
  setContainerLabels() {
    this.alertService.start('Setting labels');
    return this.containersService.updateLabels(this.tool.id, this.containerEditData.labels.join(', ')).subscribe(
      (tool) => {
        this.updateContainer.setTool(tool);
        this.labelsEditMode = false;
        this.alertService.simpleSuccess();
      },
      (error) => {
        this.alertService.detailedError(error);
      }
    );
  }

  cancelLabelChanges(): void {
    this.containerEditData.labels = this.dockstoreService.getLabelStrings(this.tool.labels);
    this.labelsEditMode = false;
    this.labelFormControl.setValue(null);
  }

  public toolCopyBtnClick(copyBtn: string): void {
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
      this.updateUrl(this.tool.tool_path, 'my-tools', 'containers', this.selectedVersion);
    }
    if (this.selectVersion) {
      this.gA4GHFilesService.updateFiles(this.tool.path, this.selectedVersion.name);
      this.updateVersionsFileTypes(this.tool.id, this.selectedVersion.id);
    }
    this.onTagChange(tag);
    this.schema = this.bioschemaService.getToolSchema(this.tool, this.selectedVersion);
  }

  setEntryTab(tabName: string): void {
    this.currentTab = tabName;
    if (this.tool != null) {
      this.updateUrl(this.tool.tool_path, 'my-tools', 'containers', this.selectedVersion);
    }
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
    this.labelFormControl.setValue(null);
  }

  removeLabel(label: any): void {
    const index = this.containerEditData.labels.indexOf(label);

    if (index >= 0) {
      this.containerEditData.labels.splice(index, 1);
    }
  }
}
