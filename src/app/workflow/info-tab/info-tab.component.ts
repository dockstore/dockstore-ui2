import { Tooltip } from '../../shared/tooltip';
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

import { validationDescriptorPatterns } from './../../shared/validationMessages.model';
import { InfoTabService } from './info-tab.service';
import { StateService } from './../../shared/state.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, OnInit, Input } from '@angular/core';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Dockstore } from '../../shared/dockstore.model';
import { ga4ghPath } from './../../shared/constants';

@Component({
  selector: 'app-info-tab',
  templateUrl: './info-tab.component.html',
  styleUrls: ['./info-tab.component.css']
})
export class InfoTabComponent implements OnInit {
  @Input() validVersions;
  @Input() defaultVersion;
  @Input() workflow;
  currentVersion: WorkflowVersion;
  downloadZipLink: string;
  isValidVersion = false;

  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this.currentVersion = value;
      const found = this.validVersions.find((version: WorkflowVersion) => {
        return version.id === value.id;
      });
      if (found) {
        this.isValidVersion = true;
      }
      this.trsLink = this.getTRSLink(this.workflow.full_workflow_path, value.name, this.workflow.descriptorType);
      this.downloadZipLink = Dockstore.API_URI + '/workflows/' + this.workflow.id + '/zip/' + this.currentVersion.id;
    }
  }

  public validationPatterns = validationDescriptorPatterns;
  public WorkflowType = Workflow;
  public tooltip = Tooltip;
  workflowPathEditing: boolean;
  defaultTestFilePathEditing: boolean;
  isPublic: boolean;
  trsLink: string;
  public refreshMessage: string;
  constructor(private workflowService: WorkflowService, private workflowsService: WorkflowsService, private stateService: StateService,
  private infoTabService: InfoTabService) { }

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
