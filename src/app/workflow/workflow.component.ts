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
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { DateService } from '../shared/date.service';
import { Dockstore } from '../shared/dockstore.model';
import { DockstoreService } from '../shared/dockstore.service';
import { Entry } from '../shared/entry';
import { ProviderService } from '../shared/provider.service';
import { Tag } from '../shared/swagger/model/tag';
import { WorkflowVersion } from '../shared/swagger/model/workflowVersion';
import { TrackLoginService } from '../shared/track-login.service';
import { WorkflowService } from '../shared/workflow.service';
import { ErrorService } from './../shared/error.service';
import { ExtendedWorkflow } from './../shared/models/ExtendedWorkflow';
import { RefreshService } from './../shared/refresh.service';
import { StateService } from './../shared/state.service';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';
import { PublishRequest } from './../shared/swagger/model/publishRequest';
import { Workflow } from './../shared/swagger/model/workflow';
import { UrlResolverService } from './../shared/url-resolver.service';
import { SourceFile } from '../shared/swagger/model/sourceFile';

const importHttpRegEx: RegExp = new RegExp(/^\s*import\s+"https?/, 'm');

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Entry {
  workflowEditData: any;
  dnastackURL: string;
  fireCloudURL: string;
  public wdlHasHttpImports: boolean;
  public wdlHasFileImports: boolean;
  public enableLaunchWithFireCloud = Dockstore.FEATURES.enableLaunchWithFireCloud;
  private lastWorkflow: ExtendedWorkflow;
  private lastVersion: WorkflowVersion;
  public workflow;
  public missingWarning: boolean;
  public title: string;
  private workflowSubscription: Subscription;
  private workflowCopyBtnSubscription: Subscription;
  private workflowCopyBtn: string;
  public sortedVersions: Array<Tag | WorkflowVersion> = [];
  private resourcePath: string;
  public showRedirect = false;
  public githubPath = 'github.com/';
  public gitlabPath = 'gitlab.com/';
  public bitbucketPath = 'bitbucket.org/';
  validTabs = ['info', 'labels', 'versions', 'files', 'tools', 'dag'];

  constructor(private dockstoreService: DockstoreService, dateService: DateService, private refreshService: RefreshService,
    private workflowsService: WorkflowsService, trackLoginService: TrackLoginService, providerService: ProviderService,
    router: Router, private workflowService: WorkflowService,
    stateService: StateService, errorService: ErrorService, urlResolverService: UrlResolverService,
    location: Location, activatedRoute: ActivatedRoute) {
    super(trackLoginService, providerService, router,
      stateService, errorService, dateService, urlResolverService, activatedRoute, location);
    this._toolType = 'workflows';
    this.location = location;
    this.redirectAndCallDiscourse('/my-workflows');
    this.resourcePath = this.location.prepareExternalUrl(this.location.path());
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

  /**
   * Populate the extra ExtendedWorkflow properties
   */
  setProperties() {
    const workflowRef: ExtendedWorkflow = this.workflow;
    this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    this.shareURL = window.location.href;
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
    workflowRef.agoMessage = this.dateService.getAgoMessage(new Date(workflowRef.last_modified_date).getTime());
    workflowRef.versionVerified = this.dockstoreService.getVersionVerified(workflowRef.workflowVersions);
    workflowRef.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(workflowRef);
    this.resetWorkflowEditData();
    if (this.isWdl(workflowRef)) {
      const myParams = new URLSearchParams();
      myParams.set('path', workflowRef.full_workflow_path);
      myParams.set('descriptorType', workflowRef.descriptorType);
      this.dnastackURL = Dockstore.DNASTACK_IMPORT_URL + '?' + myParams;
    }
  }

  public isWdl(workflowRef: ExtendedWorkflow) {
    return workflowRef && workflowRef.full_workflow_path && workflowRef.descriptorType === 'wdl';
  }

  public gotoFirecloud() {
    if (this.fireCloudURL) {
      window.open(this.fireCloudURL);
    }
  }

  /**
   * Checks WDL for import statements, setting wdlHasFileImports and wdlHasHttpImports properties
   * accordingly. If the WDL has file imports, doesn't bother to check if there are http imports, to save
   * an Ajax call.
   *
   * Also sets the fireCloudURL property if the WDL has no file imports.
   *
   * This can be done more cleanly, but since code has been moved and substantially changed in develop branch,
   * leaving like this for hot fix.
   *
   * @param {ExtendedWorkflow} workflowRef
   */
  private checkWdlForImportsAndSetFirecloudUrl(workflowRef: ExtendedWorkflow) {
    this.fireCloudURL = null;
    this.wdlHasFileImports = false;
    this.wdlHasHttpImports = false;
    if (this.isWdl(workflowRef)) {
      const version: WorkflowVersion = this.selectedVersion;
      if (version) {
        if (version !== this.lastVersion || this.lastWorkflow !== workflowRef) {
          this.lastVersion = version;
          this.lastWorkflow = workflowRef;
          this.workflowsService.secondaryWdl(workflowRef.id, version.name).subscribe((sourceFiles: Array<SourceFile>) => {
            if (!sourceFiles || sourceFiles.length === 0) {
              this.workflowsService.wdl(workflowRef.id, version.name).subscribe((sourceFile) => {
                this.wdlHasHttpImports = importHttpRegEx.test(sourceFile.content);
              });
              if (this.enableLaunchWithFireCloud) {
                this.fireCloudURL = `${Dockstore.FIRECLOUD_IMPORT_URL}/${workflowRef.full_workflow_path}:${version.name}`;
              }
            } else {
              this.wdlHasFileImports = true;
            }
          });
        }
      }
    }
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
      this.checkWdlForImportsAndSetFirecloudUrl(this.workflow);
    }
  }

  public subscriptions(): void {
    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        if (workflow) {
          this.published = this.workflow.is_published;
          this.selectedVersion = this.selectVersion(this.workflow.workflowVersions, this.urlVersion,
            this.workflow.defaultVersion);
        }
        this.setUpWorkflow(workflow);
      }
    );
    this.workflowCopyBtnSubscription = this.workflowService.copyBtn$.subscribe(
      workflowCopyBtn => {
        this.workflowCopyBtn = workflowCopyBtn;
      }
    );
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
            this.checkWdlForImportsAndSetFirecloudUrl(workflow);

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

  publishDisable() {
    return this.refreshMessage !== null || !this.isValid() || this.workflow.mode === Workflow.ModeEnum.STUB;
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

  onDestroy(): void {
    this.workflowSubscription.unsubscribe();
    this.workflowCopyBtnSubscription.unsubscribe();
  }

  restubWorkflow() {
    this.workflowsService.restub(this.workflow.id).subscribe(response => {
      this.workflowService.setWorkflow(response);
    });
  }

  resetWorkflowEditData() {
    const labelArray = this.dockstoreService.getLabelStrings(this.workflow.labels);
    const workflowLabels = labelArray.join(', ');
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
  setWorkflowLabels(): any {
    return this.workflowsService.updateLabels(this.workflow.id, this.workflowEditData.labels)
      .subscribe(workflow => {
        this.workflow.labels = workflow.labels;
        this.workflowService.setWorkflow(workflow);
        this.labelsEditMode = false;
      });
  }

  refresh() {
    this.refreshService.refreshWorkflow();
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
    }
    this.checkWdlForImportsAndSetFirecloudUrl(this.workflow);
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
}
