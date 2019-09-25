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
import { AfterViewInit, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { PublishedToolsDataSource } from '../containers/list/published-tools.datasource';
import { PublishedWorkflowsDataSource } from '../workflows/list/published-workflows.datasource';
import { formInputDebounceTime } from './constants';
import { DateService } from './date.service';
import { EntryType } from './enum/entry-type';
import { ProviderService } from './provider.service';
import { SessionQuery } from './session/session.query';
import { PaginatorService } from './state/paginator.service';
import { DockstoreTool, Workflow } from './swagger';

export abstract class ToolLister implements AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<{}> = new Subject();
  protected previewMode = false;
  protected displayTable = false;
  protected publishedTools = [];
  protected verifiedLink: string;
  public length$: Observable<number>;
  public pageSize$: Observable<number>;
  public pageIndex$: Observable<number>;
  constructor(
    private paginatorService: PaginatorService,
    protected providerService: ProviderService,
    private dateService: DateService,
    protected sessionQuery: SessionQuery
  ) {
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  abstract type: 'tool' | 'workflow';
  abstract displayedColumns: Array<string>;
  public dataSource: PublishedWorkflowsDataSource | PublishedToolsDataSource;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('input', { static: true }) input: ElementRef;

  /**
   * Get whether the entry is considered verified or not
   * @abstract
   * @param {((DockstoreTool | Workflow))} entry  The entry to get verified status
   * @returns {boolean}  True if entry is verified, false otherwise
   * @memberof ToolLister
   */
  abstract getVerified(entry: DockstoreTool | Workflow): boolean;

  ngAfterViewInit() {
    setTimeout(() => {
      // Initial load
      this.loadPublishedEntries();

      // Handle paginator changes
      merge(this.paginator.page)
        .pipe(
          distinctUntilChanged(),
          tap(() => this.loadPublishedEntries()),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe(() => this.paginatorService.setPaginator(this.type, this.paginator.pageSize, this.paginator.pageIndex));

      // Handle sort changes
      this.sort.sortChange
        .pipe(
          tap(() => {
            this.paginator.pageIndex = 0;
            this.loadPublishedEntries();
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe();

      // Handle input text field changes
      fromEvent(this.input.nativeElement, 'keyup')
        .pipe(
          debounceTime(formInputDebounceTime),
          distinctUntilChanged(),
          tap(() => {
            this.paginator.pageIndex = 0;
            this.loadPublishedEntries();
          }),
          takeUntil(this.ngUnsubscribe)
        )
        .subscribe();
    });
  }

  /**
   * Loads the published entries (either ExtendedDockstoreTools or ExtendedWorkflows)
   * from the paginated published entries endpoint
   * @memberof ToolLister
   */
  loadPublishedEntries() {
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
    const entryType: EntryType = this.sessionQuery.getValue().entryType;
    this.dataSource.loadEntries(
      entryType,
      this.input.nativeElement.value,
      direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sort.active
    );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
