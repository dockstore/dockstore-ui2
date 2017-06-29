import { StateService } from './../shared/state.service';
import {Component, OnDestroy} from '@angular/core';
import { Router } from '@angular/router';
import { CommunicatorService } from '../shared/communicator.service';
import { DateService } from '../shared/date.service';

import { DockstoreService } from '../shared/dockstore.service';
import { ProviderService } from '../shared/provider.service';
import { WorkflowService } from '../shared/workflow.service';
import { ToolService } from '../shared/tool.service';
import { Tool } from '../shared/tool';

import { ContainerService } from '../shared/container.service';
import { validationPatterns } from '../shared/validationMessages.model';

@Component({
  selector: 'app-workflow',
  templateUrl: './workflow.component.html',
  styleUrls: ['./workflow.component.css']
})
export class WorkflowComponent extends Tool {
  labels: string[];
  mode: string;
  labelsEditMode: boolean;
  workflowEditData: any;
  labelPattern = validationPatterns.label;
  totalShare = 0;
  shareURL: string;
  constructor(private dockstoreService: DockstoreService,
              private dateService: DateService,
              private updateWorkflow: WorkflowService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              router: Router,
              workflowService: WorkflowService,
              containerService: ContainerService,
              stateService: StateService) {
    super(toolService, communicatorService, providerService, router,
          workflowService, containerService, stateService, 'workflows');
  }
  setProperties() {
    const workflowRef = this.workflow;
    this.labels = this.dockstoreService.getLabelStrings(this.workflow.labels);
    this.shareURL = window.location.href;
    workflowRef.email = this.dockstoreService.stripMailTo(workflowRef.email);
    workflowRef.agoMessage = this.dateService.getAgoMessage(workflowRef.last_modified);
    workflowRef.versionVerified = this.dockstoreService.getVersionVerified(workflowRef.workflowVersions);
    workflowRef.verifiedSources = this.dockstoreService.getVerifiedWorkflowSources(workflowRef);
    workflowRef.verifiedLinks = this.dateService.getVerifiedLink();
    this.resetWorkflowEditData();
  }
  sumCounts(count) {
    this.totalShare += count;
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

  toggleLabelsEditMode() {
    this.labelsEditMode = !this.labelsEditMode;
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
    subscribe(
      workflow => {
        this.workflow.labels = workflow.labels;
        this.updateWorkflow.setWorkflow(workflow);
        this.labelsEditMode = false;
      }
    );
  }
}
