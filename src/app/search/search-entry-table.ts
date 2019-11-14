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
import { OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { DateService } from '../shared/date.service';
import { DockstoreTool, Workflow } from '../shared/swagger';
import { SearchQuery } from './state/search.query';
import { Base } from '../shared/base';
import { takeUntil } from 'rxjs/operators';
import { SearchService } from './state/search.service';

export abstract class SearchEntryTable extends Base implements OnInit {
  @ViewChild(MatPaginator, { static: true }) protected paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) protected sort: MatSort;
  protected verifiedLink: string;
  protected ngUnsubscribe: Subject<{}> = new Subject();

  public readonly displayedColumns = ['name', 'verified', 'author', 'descriptorType', 'projectLinks', 'starredUsers'];
  abstract dataSource: MatTableDataSource<Workflow | DockstoreTool>;

  static compareAttributes(a: DockstoreTool | Workflow, b: DockstoreTool | Workflow, attribute: string, direction: string) {
    let aVal = a[attribute];
    let bVal = b[attribute];
    console.log(attribute);

    // regardless of sort direction, null or empty values go at the end
    if (!aVal) {
      return 1;
    }
    if (!bVal) {
      return -1;
    }

    // ignore case when sorting by author or name
    if (attribute === 'author' || attribute === 'name') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }
    if (direction === 'asc') {
      return aVal < bVal ? -1 : 1;
    } else if (direction === 'desc') {
      return aVal < bVal ? 1 : -1;
    }
  }

  abstract privateNgOnInit(): void;

  constructor(protected dateService: DateService, protected searchQuery: SearchQuery, protected searchService: SearchService) {
    super();
    this.verifiedLink = this.dateService.getVerifiedLink();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.searchQuery.pageSize$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(pageSize => {
      this.dataSource.paginator.pageSize = pageSize;
      this.privateNgOnInit();
    });
  }

  updatePageSize($event: any) {
    this.searchService.setPageSize($event.pageSize);
  }
}
