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
import { MatLegacyTableDataSource as MatTableDataSource, MatLegacyTableModule } from '@angular/material/legacy-table';
import { DateService } from '../../shared/date.service';
import { Workflow } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { JoinWithEllipsesPipe } from 'app/search/join-with-ellipses.pipe';
import { SearchAuthorsHtmlPipe } from 'app/search/search-authors-html.pipe';
import { DescriptorLanguagePipe } from '../../shared/entry/descriptor-language.pipe';
import { MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { AiBubbleComponent } from '../../shared/ai-bubble/ai-bubble.component';
import { RouterLink } from '@angular/router';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { NgIf, NgFor, KeyValuePipe, DatePipe } from '@angular/common';
import TopicSelectionEnum = Workflow.TopicSelectionEnum;
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { DoiBadgeComponent } from 'app/shared/entry/doi/doi-badge/doi-badge.component';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyOptionModule } from '@angular/material/legacy-core';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { RouterLinkPipe } from 'app/entry/router-link.pipe';
import { MatDividerModule } from '@angular/material/divider';

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
    MatLegacyProgressBarModule,
    MatLegacyTableModule,
    MatSortModule,
    MatLegacyTooltipModule,
    RouterLink,
    AiBubbleComponent,
    ExtendedModule,
    MatIconModule,
    FontAwesomeModule,
    NgFor,
    MatLegacyPaginatorModule,
    KeyValuePipe,
    DescriptorLanguagePipe,
    SearchAuthorsHtmlPipe,
    JoinWithEllipsesPipe,
    MatLegacyCardModule,
    FlexLayoutModule,
    DatePipe,
    DoiBadgeComponent,
    MatLegacyFormFieldModule,
    MatLegacyOptionModule,
    MatLegacySelectModule,
    EntryToDisplayNamePipe,
    RouterLinkPipe,
    MatDividerModule,
  ],
})
export class SearchWorkflowTableComponent extends SearchEntryTable implements OnInit {
  public dataSource: MatTableDataSource<SearchResult<Workflow>>;
  constructor(dateService: DateService, searchQuery: SearchQuery, searchService: SearchService) {
    super(dateService, searchQuery, searchService);
  }

  protected readonly TopicSelectionEnum = TopicSelectionEnum;
}
