import { RefreshService } from '../../shared/refresh.service';
import { ErrorService } from '../../shared/error.service';
import { StateService } from './../../shared/state.service';
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

import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { DateService } from '../../shared/date.service';

import { Versions } from '../../shared/versions';
import { DockstoreService } from '../../shared/dockstore.service';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Workflow } from './../../shared/swagger/model/workflow';


@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent extends Versions implements OnInit {
  @Input() versions: Array<any>;
  @Input() verifiedSource: Array<any>;
  @Input() workflowId: number;
  _selectedVersion: WorkflowVersion;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
    }
  }
  @Output() selectedVersionChange = new EventEmitter<WorkflowVersion>();
  public WorkflowType = Workflow;
  workflow: any;
  setNoOrderCols(): Array<number> {
    return [4, 5];
  }

  constructor(dockstoreService: DockstoreService, dateService: DateService, protected stateService: StateService,
    private errorService: ErrorService, private workflowService: WorkflowService, private workflowsService: WorkflowsService,
    private refreshService: RefreshService) {
    super(dockstoreService, dateService, stateService);
  }

  ngOnInit() {
    this.publicPageSubscription();
    this.workflowService.workflow$.subscribe(workflow => {
      this.workflow = workflow;
      if (workflow) {
        this.defaultVersion = workflow.defaultVersion;
      }
      this.dtOptions = {
        bFilter: false,
        bPaginate: false,
        columnDefs: [
          {
            orderable: false,
            targets: this.setNoOrderCols()
          }
        ]
      };
    });
  }

  updateDefaultVersion(newDefaultVersion: string): void {
    if (this.publicPage) {
      return;
    }
    const message = 'Updating default workflow version';
    this.workflow.defaultVersion = newDefaultVersion;
    this.stateService.setRefreshMessage(message + '...');
    this.workflowsService.updateWorkflow(this.workflowId, this.workflow).subscribe(
      response => {
        this.refreshService.handleSuccess(message);
        this.refreshService.refreshWorkflow();
      },
      error => this.refreshService.handleError(message, error));
  }

  getVerifiedSource(name: string) {
    return this.dockstoreService.getVerifiedSource(name, this.verifiedSource);
  }

  /**
   * Updates the version and emits an event for the parent component
   * @param {WorkflowVersion} version - version to make the selected version
   * @returns {void}
   */
  setVersion(version: WorkflowVersion): void {
    this._selectedVersion = version;
    this.selectedVersionChange.emit(this._selectedVersion);
  }
}
