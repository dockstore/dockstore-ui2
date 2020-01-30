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
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatSort, MatTableDataSource } from '@angular/material';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Workflow } from '../../shared/swagger/model/workflow';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';
import { Versions } from '../../shared/versions';

@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.css']
})
export class VersionsWorkflowComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  @Input() versions: Array<any>;
  @Input() workflowId: number;
  zenodoUrl: string;
  _selectedVersion: WorkflowVersion;
  Dockstore = Dockstore;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
    }
  }
  dataSource = new MatTableDataSource(this.versions);
  @Output() selectedVersionChange = new EventEmitter<WorkflowVersion>();
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  public WorkflowType = Workflow;
  workflow: ExtendedWorkflow;
  setNoOrderCols(): Array<number> {
    return [4, 5];
  }

  constructor(
    dockstoreService: DockstoreService,
    dateService: DateService,
    private alertService: AlertService,
    private extendedWorkflowQuery: ExtendedWorkflowQuery,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    protected sessionQuery: SessionQuery
  ) {
    super(dockstoreService, dateService, sessionQuery);
    this.sortColumn = 'last_modified';
  }

  setDisplayColumns(publicPage: boolean) {
    if (publicPage) {
      this.displayedColumns = ['name', 'last_modified', 'valid', 'verified', 'snapshot', 'actions'];
    } else {
      this.displayedColumns = ['name', 'last_modified', 'valid', 'hidden', 'verified', 'snapshot', 'actions'];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges() {
    this.dataSource.data = this.versions;
  }

  ngOnInit() {
    this.zenodoUrl = Dockstore.ZENODO_AUTH_URL ? Dockstore.ZENODO_AUTH_URL.replace('oauth/authorize', '') : '';
    this.publicPageSubscription();
    this.extendedWorkflowQuery.extendedWorkflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => {
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

  /**
   * Updates the version and emits an event for the parent component
   * @param {WorkflowVersion} version - version to make the selected version
   * @returns {void}
   */
  setVersion(version: WorkflowVersion): void {
    this._selectedVersion = version;
    this.alertService.start('Changing version to ' + version.name);
    this.alertService.detailedSuccess();
    this.selectedVersionChange.emit(this._selectedVersion);
  }
}
