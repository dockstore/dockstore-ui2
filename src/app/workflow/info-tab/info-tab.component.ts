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
import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AlertQuery } from '../../shared/alert/state/alert.query';
import { ga4ghPath, ga4ghWorkflowIdPrefix } from '../../shared/constants';
import { Dockstore } from '../../shared/dockstore.model';
import { EntryTab } from '../../shared/entry/entry-tab';
import { ExtendedWorkflowsService } from '../../shared/extended-workflows.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor } from '../../shared/swagger';
import { Workflow } from '../../shared/swagger/model/workflow';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { Tooltip } from '../../shared/tooltip';
import { validationDescriptorPatterns } from '../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent extends EntryTab implements OnInit, OnChanges {
  @Input() validVersions;
  @Input() defaultVersion;
  @Input() extendedWorkflow: ExtendedWorkflow;
  public workflow: Workflow;
  currentVersion: WorkflowVersion;
  downloadZipLink: string;
  isValidVersion = false;
  @Input() selectedVersion: WorkflowVersion;

  public validationPatterns = validationDescriptorPatterns;
  public WorkflowType = Workflow;
  public tooltip = Tooltip;
  workflowPathEditing: boolean;
  defaultTestFilePathEditing: boolean;
  isPublic: boolean;
  trsLink: string;
  descriptorType$: Observable<ToolDescriptor.TypeEnum>;
  isNFL$: Observable<boolean>;
  ToolDescriptor = ToolDescriptor;
  public isRefreshing$: Observable<boolean>;
  modeTooltipContent = `<b>STUB:</b> Basic metadata pulled from source control.<br />
  <b>FULL:</b> Full content synced from source control.<br />
  <b>HOSTED:</b> Workflow metadata and files hosted on Dockstore.`;
  constructor(private workflowService: WorkflowService, private workflowsService: ExtendedWorkflowsService,
    private sessionQuery: SessionQuery, private infoTabService: InfoTabService, private alertQuery: AlertQuery,
    private workflowQuery: WorkflowQuery) {
    super();
  }

  ngOnChanges() {
    this.workflow = JSON.parse(JSON.stringify(this.extendedWorkflow));
    if (this.selectedVersion && this.workflow) {
      this.currentVersion = this.selectedVersion;
      this.trsLink = this.getTRSLink(this.workflow.full_workflow_path, this.selectedVersion.name, this.workflow.descriptorType,
        this.selectedVersion.workflow_path);
      const found = this.validVersions.find((version: WorkflowVersion) => version.id === this.selectedVersion.id);
      this.isValidVersion = found ? true : false;
      this.downloadZipLink = Dockstore.API_URI + '/workflows/' + this.workflow.id + '/zip/' + this.currentVersion.id;
    } else {
      this.isValidVersion = false;
      this.trsLink = null;
    }
  }

  ngOnInit() {
    this.descriptorType$ = this.workflowQuery.descriptorType$;
    this.isNFL$ = this.workflowQuery.isNFL$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isPublic => this.isPublic = isPublic);
    this.infoTabService.workflowPathEditing$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(editing => this.workflowPathEditing = editing);
    this.infoTabService.defaultTestFilePathEditing$.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe(editing => this.defaultTestFilePathEditing = editing);
  }

  /**
   * Handle restubbing a workflow
   * TODO: Handle restub error
   *
   * @memberof InfoTabComponent
   */
  restubWorkflow() {
    this.workflowsService.restub(this.workflow.id).subscribe((restubbedWorkflow: Workflow) => {
      this.workflowService.setWorkflow(restubbedWorkflow);
      this.workflowService.upsertWorkflowToWorkflow(restubbedWorkflow);
    });
  }

  downloadZip() {
    this.workflowsService.getWorkflowZip(this.workflow.id, this.currentVersion.id, 'response').subscribe((data: HttpResponse<any>) => {
      const blob = new Blob([data.body], { type: 'application/zip'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  toggleEditWorkflowPath() {
    if (this.workflowPathEditing) {
      this.save();
    }
    this.infoTabService.setWorkflowPathEditing(!this.workflowPathEditing);
  }

  toggleEditDefaultTestFilePath() {
    if (this.defaultTestFilePathEditing) {
      this.save();
    }
    this.infoTabService.setDefaultTestFilePathEditing(!this.defaultTestFilePathEditing);
  }

  save() {
    this.infoTabService.updateAndRefresh(this.workflow);
  }

  update() {
    this.infoTabService.update(this.workflow);
  }

  /**
    * Cancel button function
    *
    * @memberof InfoTabComponent
    */
  cancelEditing(): void {
    this.infoTabService.cancelEditing();
  }

  descriptorLanguages(): Array<string> {
    return this.infoTabService.descriptorLanguageMap;
  }

  /**
   * Returns a link to the primary descriptor for the given workflow version
   * @param path full workflow path
   * @param versionName name of version
   * @param descriptorType descriptor type (CWL or WDL)
   * @param descriptorPath primary descriptor path
   */
  getTRSLink(path: string, versionName: string, descriptorType: string,
    descriptorPath: string): string {
    return `${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent(ga4ghWorkflowIdPrefix + path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-` + descriptorType.toUpperCase() +
      `/descriptor/` + descriptorPath;
  }
}
