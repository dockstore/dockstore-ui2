import { Subscription } from 'rxjs/Subscription';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';
import { ErrorService } from './../container/error.service';
import { Dockstore } from '../shared/dockstore.model';
import { Workflow } from './../shared/swagger/model/workflow';
import * as WorkflowMode from './../shared/swagger/model/workflow';
import { PublishRequest } from './../shared/models/PublishRequest';
import { RefreshService } from './../shared/refresh.service';
import { StateService } from './../shared/state.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';
import { URLSearchParams } from '@angular/http';

import { DockstoreService } from '../shared/dockstore.service';
import { ProviderService } from '../shared/provider.service';
import { WorkflowService } from '../shared/workflow.service';
import { Entry } from '../shared/entry';

import { ContainerService } from '../shared/container.service';
import { validationPatterns } from '../shared/validationMessages.model';
import { TrackLoginService } from '../shared/track-login.service';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Entry {
  mode: string;
  workflowEditData: any;
  dnastackURL: string;
  public workflow;
  private workflowSubscription: Subscription;
  private workflowCopyBtnSubscription: Subscription;
  private workflowCopyBtn: string;
  constructor(private dockstoreService: DockstoreService, private dateService: DateService, private refreshService: RefreshService,
    private workflowsService: WorkflowsService, trackLoginService: TrackLoginService, providerService: ProviderService,
    router: Router, private workflowService: WorkflowService,
    stateService: StateService, errorService: ErrorService) {
    super(trackLoginService, providerService, router,
      stateService, errorService);
    this._toolType = 'workflows';
  }

  isPublic(): boolean {
    return this.isWorkflowPublic;
  }

  public resetCopyBtn(): void {
    this.workflowService.setCopyBtn(null);
  }

  setProperties() {
    const workflowRef: any = this.workflow;
    this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    this.shareURL = window.location.href;
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
    workflowRef.agoMessage = this.dateService.getAgoMessage(workflowRef.last_modified);
    workflowRef.versionVerified = this.dockstoreService.getVersionVerified(workflowRef.workflowVersions);
    workflowRef.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(workflowRef);
    workflowRef.verifiedLinks = this.dateService.getVerifiedLink();
    this.resetWorkflowEditData();
    if (workflowRef.path && workflowRef.descriptorType === 'wdl') {
      const myParams = new URLSearchParams();
      myParams.set('path', workflowRef.path);
      myParams.set('descriptorType', workflowRef.descriptorType);
      this.dnastackURL = Dockstore.DNASTACK_IMPORT_URL + '?' + myParams;
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
      this.title = this.workflow.path;
      this.initTool();
    }
  }

  public subscriptions(): void {
    this.workflowSubscription = this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        if (workflow) {
          this.published = this.workflow.is_published;
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
      this.title = this.decodedString(url.replace(`/${this._toolType}/`, ''));
      // Only get published workflow if the URI is for a specific workflow (/containers/quay.io%2FA2%2Fb3)
      // as opposed to just /tools or /docs etc.
      this.workflowsService.getPublishedWorkflowByPath(this.encodedString(this.title), this._toolType)
        .subscribe(workflow => {
          this.workflowService.setWorkflow(workflow);
        }, error => {
          this.router.navigate(['../']);
        });
    }
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.workflow.workflowVersions);
  }

  setTab(tab: string) {
    this.mode = tab;
  }

  checkMode(tab: string) {
    return (tab === this.mode);
  }

  publishDisable() {
    return this.refreshing || !this.isValid() || this.workflow.mode === WorkflowMode.Workflow.ModeEnum.STUB;
  }

  publish() {
    if (this.publishDisable()) {
      return;
    } else {
      const request: PublishRequest = new PublishRequest();
      request.publish = this.published;
      this.workflowsService.publish(this.workflow.id, request).subscribe(
        response => this.workflow.is_published = response.is_published, err => this.published = !this.published);
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
    return this.dockstoreService.setWorkflowLabels(this.workflow.id, this.workflowEditData.labels).
      subscribe(workflow => {
        this.workflow.labels = workflow.labels;
        this.workflowService.setWorkflow(workflow);
        this.labelsEditMode = false;
      });
  }

  refresh() {
    this.refreshService.refreshWorkflow();
  }
}
