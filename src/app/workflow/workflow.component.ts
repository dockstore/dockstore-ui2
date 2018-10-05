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
import { Component, Input } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { ga4ghWorkflowIdPrefix } from '../shared/constants';
import { DateService } from '../shared/date.service';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { ErrorService } from '../shared/error.service';
import { GA4GHFilesService } from '../shared/ga4gh-files/ga4gh-files.service';
import { ExtendedWorkflow } from '../shared/models/ExtendedWorkflow';
import { ProviderService } from '../shared/provider.service';
import { RefreshService } from '../shared/refresh.service';
import { SessionQuery } from '../shared/session/session.query';
import { SessionService } from '../shared/session/session.service';
import { Permission } from '../shared/swagger';
import { WorkflowsService } from '../shared/swagger/api/workflows.service';
import { PublishRequest } from '../shared/swagger/model/publishRequest';
import { Tag } from '../shared/swagger/model/tag';
import { Workflow } from '../shared/swagger/model/workflow';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { UrlResolverService } from '../shared/url-resolver.service';
import { WorkflowService } from '../shared/workflow.service';

import RoleEnum = Permission.RoleEnum;
@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css'],
})
export class WorkflowComponent extends Entry {
  workflowEditData: any;
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
  validTabs = ['info', 'launch', 'versions', 'files', 'tools', 'dag'];
  separatorKeysCodes = [ENTER, COMMA];
  protected canRead = false;
  protected canWrite = false;
  protected isOwner = false;
  protected readers = [];
  protected writers = [];
  protected owners = [];
  public schema;
  publishMessage = 'Publish the workflow to make it visible to the public';
  unpublishMessage = 'Unpublish the workflow to remove it from the public';
  pubUnpubMessage: string;
  @Input() user;

  constructor(private dockstoreService: DockstoreService, dateService: DateService, private refreshService: RefreshService,
    private workflowsService: WorkflowsService, trackLoginService: TrackLoginService, providerService: ProviderService,
    router: Router, private workflowService: WorkflowService,
    errorService: ErrorService, urlResolverService: UrlResolverService,
    location: Location, activatedRoute: ActivatedRoute, protected sessionQuery: SessionQuery, protected sessionService: SessionService,
      gA4GHFilesService: GA4GHFilesService) {
    super(trackLoginService, providerService, router,
      errorService, dateService, urlResolverService, activatedRoute, location, sessionService, sessionQuery, gA4GHFilesService);
    this._toolType = 'workflows';
    this.location = location;
    this.redirectAndCallDiscourse('/my-workflows');
    this.resourcePath = this.location.prepareExternalUrl(this.location.path());
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
    const workflowRef: ExtendedWorkflow = this.workflow;
    this.shareURL = window.location.href;
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
    workflowRef.agoMessage = this.dateService.getAgoMessage(new Date(workflowRef.last_modified_date).getTime());
    workflowRef.versionVerified = this.dockstoreService.getVersionVerified(workflowRef.workflowVersions);
    workflowRef.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(workflowRef);
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
      if (!workflow.providerUrl) {
        this.providerService.setUpProvider(workflow);
      }
      this.workflow = Object.assign(workflow, this.workflow);
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
    this.workflowService.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      workflow => {
        this.workflow = workflow;
        if (workflow) {
          this.published = this.workflow.is_published;
          this.setPublishMessage();
          this.selectedVersion = this.selectVersion(this.workflow.workflowVersions, this.urlVersion,
            this.workflow.defaultVersion);
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
      this.workflowsService.getPublishedWorkflowByPath(this.title)
        .subscribe(workflow => {
          this.workflowService.setWorkflow(workflow);
          this.selectedVersion = this.selectVersion(this.workflow.workflowVersions, this.urlVersion,
            this.workflow.defaultVersion);

          this.selectTab(this.validTabs.indexOf(this.currentTab));
          if (this.workflow != null) {
            this.updateUrl(this.workflow.full_workflow_path, 'my-workflows', 'workflows');
          }
          this.providerService.setUpProvider(this.workflow);
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

  publishDisable() {
    return (this.refreshMessage !== null && this.refreshMessage !== undefined) || !this.isValid() ||
    this.workflow.mode === Workflow.ModeEnum.STUB;
  }

  publish() {
    if (this.publishDisable()) {
      return;
    } else {
      const request: PublishRequest = {
        publish: this.published
      };
      this.workflowsService.publish(this.workflow.id, request).subscribe(
        (response: Workflow) => {
          this.workflowService.upsertWorkflowToWorkflow(response);
          this.workflowService.setWorkflow(response);
          this.setPublishMessage();
          if (response.checker_id) {
            this.workflowsService.getWorkflow(response.checker_id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Workflow) => {
              this.workflowService.upsertWorkflowToWorkflow(workflow);
            }, err => this.refreshService.handleError('publish error', err));
          }
        }, err => {
          this.published = !this.published;
          this.refreshService.handleError('publish error', err);
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
    if (this.workflow != null) {
      this.updateUrl(this.workflow.full_workflow_path, 'my-workflows', 'workflows');
      this.providerService.setUpProvider(this.workflow);
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

}
