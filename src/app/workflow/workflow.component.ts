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
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AlertQuery } from '../shared/alert/state/alert.query';
import { AlertService } from '../shared/alert/state/alert.service';
import { ga4ghWorkflowIdPrefix, includesValidation } from '../shared/constants';
import { DateService } from '../shared/date.service';
import { DescriptorTypeCompatService } from '../shared/descriptor-type-compat.service';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../shared/models/ExtendedWorkflow';
import { ProviderService } from '../shared/provider.service';
import { RefreshService } from '../shared/refresh.service';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { ExtendedWorkflowQuery } from '../shared/state/extended-workflow.query';
import { WorkflowQuery } from '../shared/state/workflow.query';
import { WorkflowService } from '../shared/state/workflow.service';
import { Permission, ToolDescriptor } from '../shared/swagger';
import { WorkflowsService } from '../shared/swagger/api/workflows.service';
import { PublishRequest } from '../shared/swagger/model/publishRequest';
import { Tag } from '../shared/swagger/model/tag';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { UrlResolverService } from '../shared/url-resolver.service';

import RoleEnum = Permission.RoleEnum;
import { AddEntryComponent } from '../organizations/collection/add-entry/add-entry.component';
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css'],
})
export class WorkflowComponent extends Entry {
  workflowEditData: any;
  public isRefreshing$: Observable<boolean>;
  public workflow: ExtendedWorkflow;
  public missingWarning: boolean;
  public title: string;
  private workflowCopyBtn: string;
  public sortedVersions: Array<Tag | WorkflowVersion> = [];
  private resourcePath: string;
  public showRedirect = false;
  public githubPath = 'github.com/';
  public gitlabPath = 'gitlab.com/';
  public bitbucketPath = 'bitbucket.org/';
  public descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  validTabs = ['info', 'launch', 'versions', 'files', 'tools', 'dag'];
  separatorKeysCodes = [ENTER, COMMA];
  protected canRead = false;
  protected canWrite = false;
  protected isOwner = false;
  protected readers = [];
  protected writers = [];
  protected owners = [];
  public schema;
  public extendedWorkflow$: Observable<ExtendedWorkflow>;
  publishMessage = 'Publish the workflow to make it visible to the public';
  unpublishMessage = 'Unpublish the workflow to remove it from the public';
  viewPublicMessage = 'Go to the public page for this workflow';
  pubUnpubMessage: string;
  @Input() user;

  constructor(private dockstoreService: DockstoreService, dateService: DateService, private refreshService: RefreshService,
    private workflowsService: WorkflowsService, trackLoginService: TrackLoginService, providerService: ProviderService,
    router: Router, private workflowService: WorkflowService, private extendedWorkflowQuery: ExtendedWorkflowQuery,
    urlResolverService: UrlResolverService, private alertService: AlertService,
    location: Location, activatedRoute: ActivatedRoute, protected sessionQuery: SessionQuery, protected sessionService: SessionService,
      gA4GHFilesService: GA4GHFilesService, private workflowQuery: WorkflowQuery, private alertQuery: AlertQuery,
      private descriptorTypeCompatService: DescriptorTypeCompatService, public dialog: MatDialog) {
    super(trackLoginService, providerService, router,
      dateService, urlResolverService, activatedRoute, location, sessionService, sessionQuery, gA4GHFilesService);
    this._toolType = 'workflows';
    this.location = location;
    this.redirectAndCallDiscourse('/my-workflows');
    this.resourcePath = this.location.prepareExternalUrl(this.location.path());
    this.extendedWorkflow$ = this.extendedWorkflowQuery.extendedWorkflow$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.descriptorType$ = this.workflowQuery.descriptorType$;
  }

  private processPermissions(userPermissions: Permission[]): void {
    this.owners = this.specificPermissionEmails(userPermissions, RoleEnum.OWNER);
    this.writers = this.specificPermissionEmails(userPermissions, RoleEnum.WRITER);
    this.readers = this.specificPermissionEmails(userPermissions, RoleEnum.READER);
  }

  private specificPermissionEmails(permissions: Permission[], role: RoleEnum): string[] {
    return permissions
      .filter(u => u.role === role)
      .map(c => c.email);
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
    this.schema = {
      '@type': 'ListItem',
      'position': this.workflow.id,
      'url': this.shareURL
    };
  }

  public getDefaultVersionName(): string {
    return this.workflow.defaultVersion;
  }

  private setUpWorkflow(workflow: any) {
    if (workflow) {
      this.workflow = workflow;
      this.title = this.workflow.full_workflow_path;
      this.initTool();
      this.sortedVersions = this.getSortedVersions(this.workflow.workflowVersions, this.defaultVersion);
      if (this.publicPage) {
        this.sortedVersions = this.dockstoreService.getValidVersions(this.sortedVersions);
      }
      this.canRead = this.canWrite = this.isOwner = false;
      this.readers = this.writers = this.owners = [];
      if (!this.isPublic()) {
        this.workflowsService.getWorkflowActions(this.workflow.full_workflow_path).pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((actions: Array<string>) => {
            // Alas, Swagger codegen does not generate a type for the actions
            this.canRead = actions.indexOf('READ') !== -1;
            this.canWrite = actions.indexOf('WRITE') !== -1;
            this.isOwner = actions.indexOf('SHARE') !== -1;
            // TODO: when expanding permissions beyond hosted workflows, this component will need to tolerate a 401
            // for users that are not on FireCloud
            if (this.isOwner && this.isHosted()) {
              this.workflowsService.getWorkflowPermissions(this.workflow.full_workflow_path).pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((userPermissions: Permission[]) => {
                    this.processPermissions(userPermissions);
                  }
                );
            }
          });
      }
    }
  }

  public subscriptions(): void {
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      workflow => {
        this.workflow = workflow;
        if (workflow) {
          this.published = this.workflow.is_published;
          this.setPublishMessage();
          this.selectedVersion = this.selectVersion(this.workflow.workflowVersions, this.urlVersion,
            this.workflow.defaultVersion);
          if (this.selectedVersion) {
            this.gA4GHFilesService.updateFiles(ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path, this.selectedVersion.name,
              [this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType)]);
          }
        }
        this.setUpWorkflow(workflow);
      }
    );
    this.workflowService.copyBtn$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      workflowCopyBtn => {
        this.workflowCopyBtn = workflowCopyBtn;
      }
    );
  }

  setPublishMessage() {
    this.pubUnpubMessage = this.published ? this.unpublishMessage : this.publishMessage;
  }

  public setupPublicEntry(url: String) {
    if (url.includes('workflows')) {
      // Only get published workflow if the URI is for a specific workflow (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.workflowsService.getPublishedWorkflowByPath(this.title, includesValidation)
        .subscribe(workflow => {
          this.workflowService.setWorkflow(workflow);
          this.selectTab(this.validTabs.indexOf(this.currentTab));
          if (this.workflow != null) {
            this.updateUrl(this.workflow.full_workflow_path, 'my-workflows', 'workflows');
          }
        }, error => {
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
        });
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
  }

  publishDisable(): boolean {
    return !this.isValid() || this.workflow.mode === Workflow.ModeEnum.STUB || !this.isOwner;
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
      this.workflowsService.publish(this.workflow.id, request).subscribe(
        (response: Workflow) => {
          this.workflowService.upsertWorkflowToWorkflow(response);
          this.workflowService.setWorkflow(response);
          this.setPublishMessage();
          this.alertService.detailedSuccess();
          if (response.checker_id) {
            this.workflowsService.getWorkflow(response.checker_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Workflow) => {
              this.workflowService.upsertWorkflowToWorkflow(workflow);
            }, (error: HttpErrorResponse) => this.alertService.detailedError(error));
          }
        }, (error: HttpErrorResponse) => {
          this.published = !this.published;
          this.alertService.detailedError(error);
        });
    }
  }

  isValid() {
    if (!this.workflow) {
      return false;
    }
    if (this.workflow.is_published) {
      return true;
    }
    const versionTags = this.workflow.workflowVersions;

    if (versionTags === null) {
      return false;
    }

    for (const versionTag of versionTags) {
      if (versionTag.valid) {
        return true;
      }
    }
    return false;
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

  setWorkflowLabels(): any {
    return this.workflowsService.updateLabels(this.workflow.id, this.workflowEditData.labels.join(', '))
      .subscribe(workflow => {
        this.workflow.labels = workflow.labels;
        this.workflowService.setWorkflow(workflow);
        this.labelsEditMode = false;
      });
  }

  refresh() {
    const versionName = this.selectedVersion ? this.selectedVersion.name : null;
    this.refreshService.refreshWorkflow(ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path, versionName);
  }

  /**
   * Called when the selected version is changed
   * @param {WorkflowVersion} version - New version
   * @return {void}
   */
  onSelectedVersionChange(version: WorkflowVersion): void {
    this.selectedVersion = version;
    if (this.selectVersion) {
      this.gA4GHFilesService.updateFiles(ga4ghWorkflowIdPrefix + this.workflow.full_workflow_path, this.selectedVersion.name,
        [this.descriptorTypeCompatService.stringToDescriptorType(this.workflow.descriptorType)]);
    }
    if (this.workflow != null) {
      this.updateUrl(this.workflow.full_workflow_path, 'my-workflows', 'workflows');
    }
  }

  setEntryTab(tabName: string): void {
     this.currentTab = tabName;
     if (this.workflow != null) {
       this.updateUrl(this.workflow.full_workflow_path, 'my-workflows', 'workflows');
     }
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

  addEntryToCollection() {
    this.dialog.open(AddEntryComponent, {
      data: { entryId: this.workflow.id }, width: '500px'
    });
  }

}
