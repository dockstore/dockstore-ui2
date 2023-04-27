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
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { Notebook } from '../../shared/swagger';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

/**
 * this component refers to search page not notebook listing search
 */

@Component({
  selector: 'app-search-notebook-table',
  templateUrl: './search-notebook-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-notebook-table.component.scss'],
})
export class SearchNotebookTableComponent extends SearchEntryTable implements OnInit {
  public readonly displayedColumns = ['name', 'all_authors', 'descriptorType', 'descriptorTypeSubclass', 'projectLinks', 'starredUsers'];
  readonly entryType = 'notebook';
  public dataSource: MatTableDataSource<Notebook>;
  constructor(dateService: DateService, searchQuery: SearchQuery, searchService: SearchService) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): Observable<Array<Notebook>> {
    return this.searchQuery.notebooks$;
  }
}
