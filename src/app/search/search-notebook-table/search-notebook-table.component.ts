/*
 *    Copyright 2023 OICR, UCSC
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
import { MatLegacyTableDataSource as MatTableDataSource, MatLegacyTableModule } from '@angular/material/legacy-table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { Notebook, Workflow } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { JoinWithEllipsesPipe } from 'app/search/join-with-ellipses.pipe';
import { SearchAuthorsHtmlPipe } from 'app/search/search-authors-html.pipe';
import { DescriptorLanguagePipe } from '../../shared/entry/descriptor-language.pipe';
import { MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { AiBubbleComponent } from '../../shared/ai-bubble/ai-bubble.component';
import { RouterLink } from '@angular/router';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';
import TopicSelectionEnum = Workflow.TopicSelectionEnum;

/**
 * this component refers to search page not notebook listing search
 */

@Component({
  selector: 'app-search-notebook-table',
  templateUrl: './search-notebook-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-notebook-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyProgressBarModule,
    MatLegacyTableModule,
    MatSortModule,
    MatLegacyTooltipModule,
    RouterLink,
    AiBubbleComponent,
    ExtendedModule,
    FontAwesomeModule,
    MatIconModule,
    NgFor,
    MatLegacyPaginatorModule,
    KeyValuePipe,
    DescriptorLanguagePipe,
    SearchAuthorsHtmlPipe,
    JoinWithEllipsesPipe,
  ],
})
export class SearchNotebookTableComponent extends SearchEntryTable implements OnInit {
  public readonly displayedColumns = ['name', 'all_authors', 'descriptorType', 'descriptorTypeSubclass', 'starredUsers'];
  readonly entryType = 'notebook';
  public dataSource: MatTableDataSource<SearchResult<Notebook>>;
  constructor(dateService: DateService, searchQuery: SearchQuery, searchService: SearchService) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): Observable<Array<SearchResult<Notebook>>> {
    return this.searchQuery.notebooks$;
  }

  protected readonly TopicSelectionEnum = TopicSelectionEnum;
}
