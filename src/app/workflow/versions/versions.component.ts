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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { Doi, EntryType, VersionVerifiedPlatform, WorkflowsService } from '../../shared/openapi';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { Workflow } from '../../shared/openapi/model/workflow';
import { WorkflowVersion } from '../../shared/openapi/model/workflowVersion';
import { Versions } from '../../shared/versions';
import { CommitUrlPipe } from '../../shared/entry/commit-url.pipe';
import { DescriptorLanguagePipe } from '../../shared/entry/descriptor-language.pipe';
import { DescriptorLanguageVersionsPipe } from '../../shared/entry/descriptor-language-versions.pipe';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { ViewWorkflowComponent } from '../view/view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { NgIf, NgClass, NgFor, JsonPipe, DatePipe, KeyValuePipe, KeyValue, AsyncPipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { DoiBadgeComponent } from 'app/shared/entry/doi/doi-badge/doi-badge.component';
import { PaginatorService } from '../../shared/state/paginator.service';
import { merge, Observable } from 'rxjs';
import { MatLegacyPaginator as MatPaginator, MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { VersionsDataSource } from './versions-datasource';

@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
  standalone: true,
  imports: [
    MatLegacyTableModule,
    MatSortModule,
    MatLegacyTooltipModule,
    MatIconModule,
    FlexModule,
    NgIf,
    NgFor,
    MatLegacyChipsModule,
    FontAwesomeModule,
    ViewWorkflowComponent,
    NgClass,
    ExtendedModule,
    JsonPipe,
    DatePipe,
    DescriptorLanguageVersionsPipe,
    DescriptorLanguagePipe,
    CommitUrlPipe,
    KeyValuePipe,
    DoiBadgeComponent,
    AsyncPipe,
    MatLegacyPaginatorModule,
  ],
})
export class VersionsWorkflowComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  faTag = faTag;
  faCodeBranch = faCodeBranch;
  versions: Array<WorkflowVersion>;
  @Input() workflowId: number;
  @Input() verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  @Input() publicPage: boolean;
  @Input() hasExecutionMetrics!: boolean;
  @Input() hasValidationMetrics!: boolean;

  _selectedVersion: WorkflowVersion;
  Dockstore = Dockstore;
  @Input() set selectedVersion(value: WorkflowVersion) {
    if (value != null) {
      this._selectedVersion = value;
    }
  }
  dataSource: VersionsDataSource;
  @Output() selectedVersionChange = new EventEmitter<WorkflowVersion>();
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  public WorkflowType = Workflow;
  workflow: ExtendedWorkflow;
  entryType = EntryType;
  DoiInitiatorEnum = Doi.InitiatorEnum;
  type: 'workflow' | 'tool' | 'lambdaEvent' | 'version' = 'version';
  public pageSize$: Observable<number>;
  public pageIndex$: Observable<number>;
  public versionsLength$: Observable<number>;
  private sortCol: string;

  setNoOrderCols(): Array<number> {
    return [4, 5];
  }

  constructor(
    dockstoreService: DockstoreService,
    dateService: DateService,
    private alertService: AlertService,
    private paginatorService: PaginatorService,
    private workflowsService: WorkflowsService,
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
      this.workflow?.descriptorType === Workflow.DescriptorTypeEnum.NFL ? 'engineVersions' : 'descriptorTypeVersions',
      'valid',
      hiddenColumn,
      verifiedColumn,
      'open',
      metricsColumn,
      'snapshot',
      'doi',
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
    setTimeout(() => {
      // Handle paginator changes
      merge(this.paginator.page)
        .pipe(
          distinctUntilChanged(),
          tap(() => this.loadVersions(this.publicPage)),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex));

      // Handle sort changes
      this.sort.sortChange
        .pipe(
          tap(() => {
            this.paginator.pageIndex = 0; // go back to first page after changing sort
            if (this.sort.active === 'last_modified') {
              this.sortCol = 'lastModified';
            } else {
              this.sortCol = this.sort.active;
            }
            if (this.sort.direction === '') {
              this.sortCol = null;
            }
            this.loadVersions(this.publicPage);
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe();
    });
  }

  ngOnChanges() {
    this.loadVersions(this.publicPage);
  }

  ngOnInit() {
    this.extendedWorkflowQuery.extendedWorkflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => {
      this.workflow = workflow;
      if (workflow) {
        this.defaultVersion = workflow.defaultVersion;
      }
      this.publicPageSubscription();
    });
    this.dataSource = new VersionsDataSource(this.workflowsService);
    this.versionsLength$ = this.dataSource.versionsLengthSubject$;
  }

  loadVersions(publicPage: boolean) {
    let direction: 'asc' | 'desc';
    switch (this.sort.direction) {
      case 'asc': {
        direction = 'asc';
        break;
      }
      case 'desc': {
        direction = 'desc';
        break;
      }
      default: {
        direction = 'desc';
      }
    }
    this.dataSource.loadVersions(
      publicPage,
      this.workflowId,
      direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sortCol
    );
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

  /**
   * To prevent the Angular's keyvalue pipe from sorting by key
   */
  originalOrder = (a: KeyValue<string, Doi>, b: KeyValue<string, Doi>): number => {
    return 0;
  };

  trackBy(index: number, item: WorkflowVersion) {
    return item.id;
  }
}
