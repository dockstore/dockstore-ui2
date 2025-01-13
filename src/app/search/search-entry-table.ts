/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Directive, Input, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { DateService } from '../shared/date.service';
import { SearchQuery, SearchResult } from './state/search.query';
import { SearchService } from './state/search.service';
import { EntryType, EntryTypeMetadata } from 'app/shared/openapi';

export interface SortOption {
  label: string;
  sort: Sort;
}

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class SearchEntryTable extends Base implements OnInit {
  public EntryType = EntryType;
  @Input() entryType: EntryType;
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) protected sort: MatSort;
  protected verifiedLink: string;
  protected entryTypeMetadata: EntryTypeMetadata;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  public readonly displayedColumns = ['name'];
  public readonly columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  public readonly searchEverythingFriendlyNames = new Map([
    ['full_workflow_path', 'Path'],
    ['tool_path', 'Path'],
    ['workflowVersions.sourceFiles.content', 'Source Files'],
    ['tags.sourceFiles.content', 'Source Files'],
    ['description', 'Description'],
    ['labels', 'Labels'],
    ['all_authors.name', 'Authors'],
    ['topicAutomatic', 'Topic'],
    ['categories.topic', 'Category Topic'],
    ['categories.displayName', 'Category'],
  ]);
  public defaultSortOption: SortOption = {
    label: 'Most Stars',
    sort: { active: 'starredUsers', direction: 'desc' },
  };
  public sortOptions: SortOption[] = [
    this.defaultSortOption,
    {
      label: 'Least Stars',
      sort: { active: 'starredUsers', direction: 'asc' },
    },
    {
      label: 'Name, A-Z',
      sort: { active: 'name', direction: 'asc' },
    },
    {
      label: 'Name, Z-A',
      sort: { active: 'name', direction: 'desc' },
    },
    {
      label: 'Authors, A-Z',
      sort: { active: 'all_authors', direction: 'asc' },
    },
    {
      label: 'Authors, Z-A',
      sort: { active: 'all_authors', direction: 'desc' },
    },
  ];

  //abstract readonly entryType: EntryType;
  abstract dataSource: MatTableDataSource<SearchResult>;
  //abstract privateNgOnInit(): Observable<SearchResult[]>;

  privateNgOnInit(): Observable<Array<SearchResult>> {
    switch (this.entryType) {
      case EntryType.WORKFLOW:
        return this.searchQuery.workflows$;
      case EntryType.TOOL:
        return this.searchQuery.tools$;
      case EntryType.NOTEBOOK:
        return this.searchQuery.notebooks$;
      default:
        return null;
    }
  }

  constructor(protected dateService: DateService, protected searchQuery: SearchQuery, protected searchService: SearchService) {
    super();
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.setSort(this.defaultSortOption.sort);
    this.dataSource.paginator = this.paginator;
    combineLatest([this.searchQuery.pageSize$, this.searchQuery.pageIndex$, this.privateNgOnInit()])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pageSize, pageIndex, entries]) => {
        this.dataSource.paginator.pageSize = pageSize;
        this.dataSource.paginator.pageIndex = pageIndex;
        // Must set data after paginator, just a material datatables thing.
        this.dataSource.data = entries || [];
      });
    this.dataSource.sortData = (data: SearchResult[], sort: MatSort) => {
      if (sort.active && sort.direction) {
        return data.slice().sort((a: SearchResult, b: SearchResult) => {
          return this.searchService.compareAttributes(a.source, b.source, sort.active, sort.direction, this.entryType);
        });
      } else {
        // Either the active field or direction is unset, so return the data in the original order, unsorted.
        return data;
      }
    };
  }

  updatePageSizeAndIndex($event: PageEvent) {
    this.searchService.setPageSizeAndIndex($event.pageSize, $event.pageIndex);
  }

  setSort(sortValue: Sort) {
    this.sort.active = sortValue.active;
    this.sort.direction = sortValue.direction;
    this.sort.sortChange.emit(sortValue);
  }
}
