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
import { Directive, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Base } from '../shared/base';
import { DateService } from '../shared/date.service';
import { DockstoreTool, Workflow } from '../shared/swagger';
import { SearchQuery } from './state/search.query';
import { SearchService } from './state/search.service';

@Directive()
export abstract class SearchEntryTable extends Base implements OnInit {
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) protected sort: MatSort;
  protected verifiedLink: string;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  public readonly displayedColumns = ['name', 'verified', 'author', 'descriptorType', 'projectLinks', 'starredUsers'];
  abstract dataSource: MatTableDataSource<Workflow | DockstoreTool>;
  abstract privateNgOnInit(): Observable<(DockstoreTool | Workflow)[]>;

  constructor(protected dateService: DateService, protected searchQuery: SearchQuery, protected searchService: SearchService) {
    super();
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    combineLatest([this.searchQuery.pageSize$, this.searchQuery.pageIndex$, this.privateNgOnInit()])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([pageSize, pageIndex, entries]) => {
        this.dataSource.paginator.pageSize = pageSize;
        this.dataSource.paginator.pageIndex = pageIndex;
        // Must set data after paginator, just a material datatables thing.
        this.dataSource.data = entries || [];
      });
    this.dataSource.sortData = (data: DockstoreTool[] | Workflow[], sort: MatSort) => {
      return data.slice().sort((a: Workflow | DockstoreTool, b: Workflow | DockstoreTool) => {
        return this.searchService.compareAttributes(a, b, sort.active, sort.direction);
      });
    };
  }

  updatePageSizeAndIndex($event: PageEvent) {
    this.searchService.setPageSizeAndIndex($event.pageSize, $event.pageIndex);
  }
}
