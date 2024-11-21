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
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { Workflow } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { JoinWithEllipsesPipe } from 'app/search/join-with-ellipses.pipe';
import { SearchAuthorsHtmlPipe } from 'app/search/search-authors-html.pipe';
import { DescriptorLanguagePipe } from '../../shared/entry/descriptor-language.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { AiBubbleComponent } from '../../shared/ai-bubble/ai-bubble.component';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor, KeyValuePipe } from '@angular/common';
import TopicSelectionEnum = Workflow.TopicSelectionEnum;

/**
 * this component refers to search page not workflow listing search
 */

@Component({
  selector: 'app-search-workflow-table',
  templateUrl: './search-workflow-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-workflow-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    RouterLink,
    AiBubbleComponent,
    ExtendedModule,
    MatIconModule,
    FontAwesomeModule,
    NgFor,
    MatPaginatorModule,
    KeyValuePipe,
    DescriptorLanguagePipe,
    SearchAuthorsHtmlPipe,
    JoinWithEllipsesPipe,
  ],
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
