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
import { AsyncPipe, DatePipe, JsonPipe, KeyValue, KeyValuePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCodeBranch, faTag } from '@fortawesome/free-solid-svg-icons';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { DoiBadgeComponent } from 'app/shared/entry/doi/doi-badge/doi-badge.component';
import { merge, Observable } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { BaseChartDirective } from 'ng2-charts';
import * as seedrandom from 'seedrandom';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { Dockstore } from '../../shared/dockstore.model';
import { DockstoreService } from '../../shared/dockstore.service';
import { CloudInstance, Doi, EntryType, VersionVerifiedPlatform, Workflow, WorkflowsService, WorkflowVersion } from '../../shared/openapi';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { SessionQuery } from '../../shared/session/session.query';
import { ExtendedWorkflowQuery } from '../../shared/state/extended-workflow.query';
import { PaginatorService } from '../../shared/state/paginator.service';
import { Versions } from '../../shared/versions';
import { ViewWorkflowComponent } from '../view/view.component';
import { VersionsDataSource } from './versions-datasource';
import PartnerEnum = CloudInstance.PartnerEnum;
import { DescriptorLanguageVersionsPipe } from 'app/shared/entry/descriptor-language-versions.pipe';
import { DescriptorLanguagePipe } from 'app/shared/entry/descriptor-language.pipe';
import { CommitUrlPipe } from 'app/shared/entry/commit-url.pipe';

@Component({
  selector: 'app-versions-workflow',
  templateUrl: './versions.component.html',
  styleUrls: ['./versions.component.scss'],
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatIconModule,
    FlexModule,
    NgIf,
    NgFor,
    MatChipsModule,
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
    MatPaginatorModule,
    BaseChartDirective,
  ],
})
export class VersionsWorkflowComponent extends Versions implements OnInit, OnChanges, AfterViewInit {
  faTag = faTag;
  faCodeBranch = faCodeBranch;
  versions: Array<WorkflowVersion>;
  @Input() workflowId: number;
  @Input() verifiedVersionPlatforms: Array<VersionVerifiedPlatform>;
  @Input() publicPage: boolean;

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
  protected readonly PartnerEnum = PartnerEnum;
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
    seedrandom('seed!', { global: true });
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
    this.loadVersions(this.publicPage);
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
    if (!this.dataSource) {
      return;
    }
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

  // https://github.com/davidbau/seedrandom
  data(index: number) {
    switch (index) {
      case 0:
        return [2, 5, 4, 3, 4, 6, 3, 4];
      case 1:
        return [3, 1, 2, 7, 3, 2, 4, 2];
      case 2:
        return [2, 6, 4, 3, 7, 4, 8, 10];
      case 3:
        return [5, 7, 4, 6, 2, 5, 1, 2];
      case 4:
        return [6, 3, 2, 5, 1, 3, 1, 0];
      case 5:
        return [3, 4, 2, 5, 2, 3, 2, 1];
      case 7:
        return [1, 3, 2, 3, 1, 5, 2, 1];
      default:
        let result = [];
        for (let i = 0; i < 8; i++) {
          result.push(Math.floor(0.5 + 3 * Math.random()));
        }
        return result;
    }
  }
}
