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
import { Component } from '@angular/core';
import { EntryType } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { MatDividerModule } from '@angular/material/divider';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, AsyncPipe } from '@angular/common';
import { SearchEntryTableComponent } from '../search-entry-table.component';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  standalone: true,
  imports: [NgIf, FlexModule, FontAwesomeModule, MatDividerModule, SearchEntryTableComponent, AsyncPipe],
})
export class SearchResultsComponent {
  public EntryType = EntryType;
  public noToolHits$: Observable<boolean>;
  public noWorkflowHits$: Observable<boolean>;
  public noNotebookHits$: Observable<boolean>;

  constructor(private readonly searchService: SearchService, private readonly searchQuery: SearchQuery) {
    this.noWorkflowHits$ = this.searchQuery.noWorkflowHits$;
    this.noToolHits$ = this.searchQuery.noToolHits$;
    this.noNotebookHits$ = this.searchQuery.noNotebookHits$;
  }

  // Tells the search service to tell the search filters to save its data
  saveSearchFilter() {
    this.searchService.toSaveSearch$.next(true);
  }

  getTabIndex() {
    return this.searchQuery.getValue().currentTabIndex;
  }
}
