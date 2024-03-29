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
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { Workflow } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import TopicSelectionEnum = Workflow.TopicSelectionEnum;

/**
 * this component refers to search page not workflow listing search
 */

@Component({
  selector: 'app-search-workflow-table',
  templateUrl: './search-workflow-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-workflow-table.component.scss'],
})
export class SearchWorkflowTableComponent extends SearchEntryTable implements OnInit {
  readonly entryType = 'workflow';
  public dataSource: MatTableDataSource<SearchResult<Workflow>>;
  constructor(dateService: DateService, searchQuery: SearchQuery, searchService: SearchService) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): Observable<Array<SearchResult<Workflow>>> {
    return this.searchQuery.workflows$;
  }
  protected readonly TopicSelectionEnum = TopicSelectionEnum;
}
