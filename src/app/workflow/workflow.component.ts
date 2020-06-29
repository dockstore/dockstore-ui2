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
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { AfterViewInit, Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Service } from 'app/shared/swagger/model/service';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../shared/alert/state/alert.query';
import { BioschemaService } from '../shared/bioschema.service';
import {
  ga4ghServiceIdPrefix,
  ga4ghWorkflowIdPrefix,
  includesValidation,
  myBioWorkflowsURLSegment,
  myServicesURLSegment
} from '../shared/constants';
import { DateService } from '../shared/date.service';
import { DescriptorTypeCompatService } from '../shared/descriptor-type-compat.service';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { EntryType } from '../shared/enum/entry-type';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../shared/models/ExtendedWorkflow';
import { ProviderService } from '../shared/provider.service';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { ExtendedWorkflowQuery } from '../shared/state/extended-workflow.query';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { WorkflowService } from '../shared/state/workflow.service';
import { Permission, ToolDescriptor } from '../shared/swagger';
import { WorkflowsService } from '../shared/swagger/api/workflows.service';
import { Tag } from '../shared/swagger/model/tag';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { UrlResolverService } from '../shared/url-resolver.service';

import RoleEnum = Permission.RoleEnum;
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Entry implements AfterViewInit {
  workflowEditData: any;
  public isRefreshing$: Observable<boolean>;
  public workflow: BioWorkflow | Service;
  public missingWarning: boolean;
  public title: string;
  public sortedVersions: Array<Tag | WorkflowVersion> = [];
  private resourcePath: string;
  public showRedirect = false;
  public githubPath = 'github.com/';
  public gitlabPath = 'gitlab.com/';
  public bitbucketPath = 'bitbucket.org/';
  public descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  public entryType: EntryType;
  public readonly oldLanguages = [Workflow.DescriptorTypeEnum.CWL, Workflow.DescriptorTypeEnum.WDL, Workflow.DescriptorTypeEnum.NFL];
  validTabs = [];
  separatorKeysCodes = [ENTER, COMMA];
  protected canRead = false;
  protected canWrite = false;
  protected isOwner = false;
  protected readers = [];
  protected writers = [];
  protected owners = [];
  // Whether to show the workflow action buttons or not.
  // Only show after getting actions is done or else the buttons will not appear all at once
  public showWorkflowActions = false;
  public schema;
  public extendedWorkflow$: Observable<ExtendedWorkflow>;
  public WorkflowModel = Workflow;
  public launchSupport$: Observable<boolean>;
  @Input() user;

  constructor(
    private dockstoreService: DockstoreService,
    dateService: DateService,
    bioschemaService: BioschemaService,
    private workflowsService: WorkflowsService,
    trackLoginService: TrackLoginService,
    providerService: ProviderService,
    router: Router,
    private workflowService: WorkflowService,
    private extendedWorkflowQuery: ExtendedWorkflowQuery,
    urlResolverService: UrlResolverService,
    location: Location,
    activatedRoute: ActivatedRoute,
    protected sessionQuery: SessionQuery,
    protected sessionService: SessionService,
    gA4GHFilesService: GA4GHFilesService,
    private workflowQuery: WorkflowQuery,
    private alertQuery: AlertQuery,
    private descriptorTypeCompatService: DescriptorTypeCompatService,
    public dialog: MatDialog,
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
    this._toolType = 'workflows';
    this.location = location;
    this.entryType = this.sessionQuery.getValue().entryType;
    if (this.entryType === EntryType.BioWorkflow) {
      this.validTabs = ['info', 'launch', 'versions', 'files', 'tools', 'dag'];
      this.redirectToCanonicalURL('/' + myBioWorkflowsURLSegment);
    } else {
      this.validTabs = ['info', 'versions', 'files'];
      this.redirectToCanonicalURL('/' + myServicesURLSegment);
    }
    this.resourcePath = this.location.prepareExternalUrl(this.location.path());
    this.extendedWorkflow$ = this.extendedWorkflowQuery.extendedWorkflow$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.launchSupport$ = this.workflowQuery.launchSupport$;
  }

  ngAfterViewInit() {
    if (this.publicPage) {
      this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => {
        if (workflow && workflow.topicId) {
          this.discourseHelper(workflow.topicId);
        }
      });
    }

    this.updateTabSelection();
  }

  clearState() {
    this.workflowService.clearActive();
  }

  private processPermissions(userPermissions: Permission[]): void {
    this.owners = this.specificPermissionEmails(userPermissions, RoleEnum.OWNER);
    this.writers = this.specificPermissionEmails(userPermissions, RoleEnum.WRITER);
    this.readers = this.specificPermissionEmails(userPermissions, RoleEnum.READER);
  }

  private specificPermissionEmails(permissions: Permission[], role: RoleEnum): string[] {
    return permissions.filter(u => u.role === role).map(c => c.email);
  }

  isPublic(): boolean {
    return this.isWorkflowPublic;
  }

  public resetCopyBtn(): void {
    this.workflowService.setCopyBtn(null);
  }

  isStub(): boolean {
    if (this.workflow) {
      return this.workflow.mode === Workflow.ModeEnum.STUB;
    } else {
      return true;
    }
  }

  isHosted(): boolean {
    if (this.workflow) {
      return this.workflow.mode === Workflow.ModeEnum.HOSTED;
    } else {
      return true;
    }
  }

  /**
   * Populate the extra ExtendedWorkflow properties
   */
  setProperties() {
    this.shareURL = window.location.href;
    this.resetWorkflowEditData();
    // messy prototype for a carousel https://developers.google.com/search/docs/guides/mark-up-listings
    // will need to be aggregated with a summary page
    this.schema = this.bioschemaService.getWorkflowSchema(this.workflow, this.selectedVersion);
  }

  public getDefaultVersionName(): string {
    return this.workflow.defaultVersion;
  }

  private setUpWorkflow(workflow: any) {
    if (workflow) {
      this.workflow = workflow;
      this.title = this.workflow.full_workflow_path;
      this.initTool();
      this.sortedVersions = this.getSortedWorkflowVersions(this.workflow.workflowVersions, this.defaultVersion);
      if (this.publicPage) {
        this.sortedVersions = this.dockstoreService.getValidVersions(this.sortedVersions);
      }
      this.canRead = this.canWrite = this.isOwner = false;
      this.readers = this.writers = this.owners = [];
      if (!this.isPublic()) {
        this.showWorkflowActions = false;
        this.workflowsService
          .getWorkflowActions(this.workflow.full_workflow_path, this.entryType === EntryType.Service)
          .pipe(
            finalize(() => {
              this.showWorkflowActions = true;
            }),
            takeUntil(this.ngUnsubscribe)
          )
          .subscribe((actions: Array<string>) => {
            // Alas, Swagger codegen does not generate a type for the actions
            this.canRead = actions.indexOf('READ') !== -1;
            this.canWrite = actions.indexOf('WRITE') !== -1;
            this.isOwner = actions.indexOf('SHARE') !== -1;
            // TODO: when expanding permissions beyond hosted workflows, this component will need to tolerate a 401
            // for users that are not on FireCloud
            if (this.isOwner && this.isHosted() && this.workflow) {
              this.workflowsService
                .getWorkflowPermissions(this.workflow.full_workflow_path, this.entryType === EntryType.Service)
                .pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((userPermissions: Permission[]) => {
                  this.processPermissions(userPermissions);
                });
            }
          });
      }
    }
  }

  public subscriptions(): void {
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: BioWorkflow | Service) => {
      this.workflow = workflow;
      if (workflow) {
        this.published = this.workflow.is_published;
        this.selectedVersion = this.selectWorkflowVersion(this.workflow.workflowVersions, this.urlVersion, this.workflow.defaultVersion);
        if (this.selectedVersion) {
          this.workflowService.setWorkflowVersion(this.selectedVersion);
          const prefix = this.entryType === EntryType.BioWorkflow ? ga4ghWorkflowIdPrefix : ga4ghServiceIdPrefix;
          const compatType = this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType);
          if (compatType) {
            this.gA4GHFilesService.updateFiles(prefix + this.workflow.full_workflow_path, this.selectedVersion.name, [compatType]);
          } else {
            this.gA4GHFilesService.updateFiles(prefix + this.workflow.full_workflow_path, this.selectedVersion.name, [
              this.workflow.descriptorType
            ]);
          }
        }
      }
      this.setUpWorkflow(workflow);
    });
  }

  /**
   * Select the Versions tab
   *
   * @memberof WorkflowComponent
   */
  public selectVersionsTab() {
    this.selectTab(this.validTabs.indexOf('versions'));
  }

  public setupPublicEntry(url: String) {
    if (url.includes('workflows') || url.includes('services')) {
      // Only get published workflow if the URI is for a specific workflow (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.workflowsService.getPublishedWorkflowByPath(this.title, includesValidation, this.entryType === EntryType.Service).subscribe(
        workflow => {
          this.workflowService.setWorkflow(workflow);
          this.selectTab(this.validTabs.indexOf(this.currentTab));
          this.updateWorkflowUrl(this.workflow);
        },
        error => {
          const regex = /\/workflows\/(github.com)|(gitlab.com)|(bitbucket.org)\/.+/;
          if (regex.test(this.resourcePath)) {
            this.router.navigate(['../']);
          } else {
            this.showRedirect = true;
            // Retrieve the workflow path from the URL
            const splitPath = this.resourcePath.split('/');
            const workflowPath = splitPath.slice(2, 5);
            const pathSuffix = workflowPath.join('/');

            // Create suggested paths
            this.gitlabPath += pathSuffix;
            this.githubPath += pathSuffix;
            this.bitbucketPath += pathSuffix;
          }
        }
      );
    }
  }
  /**
   * Updates the workflow (bio workflow or service) url and also checks for the null
   *
   * @private
   * @param {(Workflow | null)} workflow
   * @memberof WorkflowComponent
   */
  private updateWorkflowUrl(workflow: Workflow | null) {
    if (workflow != null) {
      const entryPath = workflow.full_workflow_path;
      if (this.entryType === EntryType.BioWorkflow) {
        this.updateUrl(entryPath, myBioWorkflowsURLSegment, 'workflows');
      } else {
        this.updateUrl(entryPath, myServicesURLSegment, 'services');
      }
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
  }

  restubWorkflow() {
    this.workflowsService.restub(this.workflow.id).subscribe(response => {
      this.workflowService.setWorkflow(response);
    });
  }

  resetWorkflowEditData() {
    const labelArray = this.dockstoreService.getLabelStrings(this.workflow.labels);
    const workflowLabels = labelArray;
    this.workflowEditData = {
      labels: workflowLabels,
      is_published: this.workflow.is_published
    };
  }
  submitWorkflowEdits() {
    if (!this.labelsEditMode) {
      this.labelsEditMode = true;
      return;
    }
    // the edit object should be recreated
    if (this.workflowEditData.labels !== 'undefined') {
      this.setWorkflowLabels();
    }
  }

  cancelLabelChanges(): void {
    this.workflowEditData.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    this.labelsEditMode = false;
  }

  // TODO: Move most of this function to the service, sadly 'this.labelsEditMode' makes it more difficult
  setWorkflowLabels() {
    this.alertService.start('Setting labels');
    this.workflowsService.updateLabels(this.workflow.id, this.workflowEditData.labels.join(', ')).subscribe(
      workflow => {
        this.workflowService.setWorkflow(workflow);
        this.labelsEditMode = false;
        this.alertService.simpleSuccess();
      },
      error => {
        this.alertService.detailedError(error);
      }
    );
  }

  /**
   * Called when the selected version is changed
   * @param {WorkflowVersion} version - New version
   * @return {void}
   */
  onSelectedVersionChange(version: WorkflowVersion): void {
    this.selectedVersion = version;
    if (this.selectVersion) {
      const prefix = this.entryType === EntryType.BioWorkflow ? ga4ghWorkflowIdPrefix : ga4ghServiceIdPrefix;
      this.gA4GHFilesService.updateFiles(prefix + this.workflow.full_workflow_path, this.selectedVersion.name, [
        this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType)
      ]);
    }
    this.workflowService.setWorkflowVersion(version);
    this.updateWorkflowUrl(this.workflow);
    this.schema = this.bioschemaService.getWorkflowSchema(this.workflow, this.selectedVersion);
  }

  setEntryTab(tabName: string): void {
    this.currentTab = tabName;
    this.updateWorkflowUrl(this.workflow);
  }

  getPageIndex(): number {
    const pageIndex = this.getIndexInURL('/workflows');
    return pageIndex;
  }

  addToLabels(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.workflowEditData.labels.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeLabel(label: any): void {
    const index = this.workflowEditData.labels.indexOf(label);

    if (index >= 0) {
      this.workflowEditData.labels.splice(index, 1);
    }
  }
}
