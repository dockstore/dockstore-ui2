/*
 *    Copyright 2019 OICR
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
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { Workflow } from '../../shared/swagger';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { MatSort } from '@angular/material';

/**
 * this component refers to search page not workflow listing search
 */

@Component({
  selector: 'app-search-workflow-table',
  templateUrl: './search-workflow-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-workflow-table.component.scss']
})
export class SearchWorkflowTableComponent extends SearchEntryTable implements OnInit {
  public dataSource: MatTableDataSource<Workflow>;
  constructor(
    private dockstoreService: DockstoreService,
    dateService: DateService,
    searchQuery: SearchQuery,
    searchService: SearchService
  ) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): void {
    this.searchQuery.workflows$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entries: Array<Workflow>) => {
      if (entries) {
        this.dataSource.data = entries;
      }
    });
  }

  getVerified(workflow: Workflow): boolean {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
