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
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { EntryType, VersionVerifiedPlatform } from '../../shared/openapi';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { Workflow } from '../../shared/openapi/model/workflow';
import { WorkflowVersion } from '../../shared/openapi/model/workflowVersion';
import { Versions } from '../../shared/versions';

@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
})
export class VersionsWorkflowComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  faTag = faTag;
  faCodeBranch = faCodeBranch;
  @Input() versions: Array<WorkflowVersion>;
  @Input() workflowId: number;
  @Input() verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
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
  @ViewChild(MatSort) sort: MatSort;
  public WorkflowType = Workflow;
  workflow: ExtendedWorkflow;
  entryType = EntryType;
  setNoOrderCols(): Array<number> {
    return [4, 5];
  }

  constructor(
    dockstoreService: DockstoreService,
    dateService: DateService,
    private alertService: AlertService,
    private extendedWorkflowQuery: ExtendedWorkflowQuery,
    protected sessionQuery: SessionQuery
  ) {
    super(dockstoreService, dateService, sessionQuery);
    this.sortColumn = 'last_modified';
  }

  /**
   * Sets the display columns; the order of the array determines the order in which columns are
   * displayed -- it's not the HTML template that determines the display order.
   * @param publicPage
   */
  setDisplayColumns(publicPage: boolean) {
    const hiddenColumn = 'hidden';
    const metricsColumn = 'metrics';
    const verifiedColumn = 'verified';
    const allColumns = [
      'name',
      'last_modified',
      'descriptorTypeVersions',
      'valid',
      hiddenColumn,
      verifiedColumn,
      'open',
      metricsColumn,
      'snapshot',
      'actions',
    ];
    this.displayedColumns = allColumns.filter((column) => {
      if (publicPage && column === hiddenColumn) {
        return false;
      }
      return true;
    });
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
    this.extendedWorkflowQuery.extendedWorkflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => {
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
            targets: this.setNoOrderCols(),
          },
        ],
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
