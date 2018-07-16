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
import { Component, Input, OnChanges, OnInit } from '@angular/core';

import { EntryTab } from '../../shared/entry/entry-tab';
import { Tooltip } from '../../shared/tooltip';
import { ga4ghPath } from './../../shared/constants';
import { StateService } from './../../shared/state.service';
import { ExtendedWorkflowsService } from './../../shared/extended-workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Dockstore } from '../../shared/dockstore.model';
import { HttpResponse } from '@angular/common/http';
import { validationDescriptorPatterns } from './../../shared/validationMessages.model';
import { WorkflowService } from './../../shared/workflow.service';
import { InfoTabService } from './info-tab.service';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent extends EntryTab implements OnInit, OnChanges {
  @Input() validVersions;
  @Input() defaultVersion;
  @Input() workflow;
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
  public refreshMessage: string;
  constructor(private workflowService: WorkflowService, private workflowsService: ExtendedWorkflowsService,
    private stateService: StateService, private infoTabService: InfoTabService) {
    super();
  }

  ngOnChanges() {
    if (this.selectedVersion && this.workflow) {
      this.currentVersion = this.selectedVersion;
      this.trsLink = this.getTRSLink(this.workflow.full_workflow_path, this.selectedVersion.name, this.workflow.descriptorType);
      const found = this.validVersions.find((version: WorkflowVersion) => {
        return version.id === this.selectedVersion.id;
      });
      this.isValidVersion = found ? true : false;
      this.downloadZipLink = Dockstore.API_URI + '/workflows/' + this.workflow.id + '/zip/' + this.currentVersion.id;
    } else {
      this.isValidVersion = false;
    }
  }

  ngOnInit() {
    this.stateService.publicPage$.subscribe(isPublic => this.isPublic = isPublic);
    this.infoTabService.workflowPathEditing$.subscribe(editing => this.workflowPathEditing = editing);
    this.infoTabService.defaultTestFilePathEditing$.subscribe(editing => this.defaultTestFilePathEditing = editing);
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
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
   */
  getTRSLink(path: string, versionName: string, descriptorType: string): string {
    return `${Dockstore.API_URI}${ga4ghPath}/tools/${encodeURIComponent('#workflow/' + path)}` +
      `/versions/${encodeURIComponent(versionName)}/plain-` + descriptorType.toUpperCase() +
      `/descriptor`;
  }
}
