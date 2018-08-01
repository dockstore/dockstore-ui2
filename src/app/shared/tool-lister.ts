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
import { MatPaginator, MatSort } from '@angular/material';
import { fromEvent, merge, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';

import { PublishedToolsDataSource } from '../containers/list/published-tools.datasource';
import { PublishedWorkflowsDataSource } from '../workflows/list/published-workflows.datasource';
import { formInputDebounceTime } from './constants';
import { DateService } from './date.service';
import { ListService } from './list.service';
import { ProviderService } from './provider.service';
import { DockstoreTool, Workflow } from './swagger';

export abstract class ToolLister implements AfterViewInit, OnDestroy {
  private ngUnsubscribe: Subject<{}> = new Subject();
  protected previewMode = false;
  protected displayTable = false;
  protected publishedTools = [];
  protected verifiedLink: string;
  public length$: Observable<number>;
  constructor(private listService: ListService,
    protected providerService: ProviderService, private dateService: DateService) {
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  abstract displayedColumns: Array<string>;
  public dataSource: (PublishedWorkflowsDataSource | PublishedToolsDataSource);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  /**
   * Get whether the entry is considered verified or not
   * @abstract
   * @param {((DockstoreTool | Workflow))} entry  The entry to get verified status
   * @returns {boolean}  True if entry is verified, false otherwise
   * @memberof ToolLister
   */
  abstract getVerified(entry: (DockstoreTool | Workflow)): boolean;

  ngAfterViewInit() {
    setTimeout(() => {
      // Initial load
      this.loadPublishedEntries();

      // Handle paginator changes
      merge(this.paginator.page).pipe(
        distinctUntilChanged(),
        tap(() => this.loadPublishedEntries()),
        takeUntil(this.ngUnsubscribe)
      )
        .subscribe();

      // Handle sort changes
      this.sort.sortChange.pipe(
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPublishedEntries();
        }),
        takeUntil(this.ngUnsubscribe)
      ).subscribe();

      // Handle input text field changes
      fromEvent(this.input.nativeElement, 'keyup').pipe(
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
    this.dataSource.loadEntries(
      this.input.nativeElement.value,
      this.sort.direction,
      this.paginator.pageIndex * this.paginator.pageSize,
      this.paginator.pageSize,
      this.sort.active);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
