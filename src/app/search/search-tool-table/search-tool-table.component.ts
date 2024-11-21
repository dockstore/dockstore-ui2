import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { AppTool, DockstoreTool } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { IsAppToolPipe } from '../is-app-tool.pipe';
import { JoinWithEllipsesPipe } from 'app/search/join-with-ellipses.pipe';
import { SearchAuthorsHtmlPipe } from 'app/search/search-authors-html.pipe';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { AiBubbleComponent } from '../../shared/ai-bubble/ai-bubble.component';
import { RouterLink } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PrivateIconComponent } from '../../shared/private-icon/private-icon.component';
import { MatSortModule } from '@angular/material/sort';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { NgIf, NgFor, UpperCasePipe, KeyValuePipe } from '@angular/common';
import TopicSelectionEnum = DockstoreTool.TopicSelectionEnum;

/**
 * this component refers to search page not tool listing search
 */

@Component({
  selector: 'app-search-tool-table',
  templateUrl: './search-tool-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-tool-table.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
    PrivateIconComponent,
    MatTooltipModule,
    RouterLink,
    AiBubbleComponent,
    ExtendedModule,
    MatIconModule,
    FlexModule,
    NgFor,
    FontAwesomeModule,
    MatPaginatorModule,
    UpperCasePipe,
    KeyValuePipe,
    SearchAuthorsHtmlPipe,
    JoinWithEllipsesPipe,
    IsAppToolPipe,
  ],
})
export class SearchToolTableComponent extends SearchEntryTable implements OnInit {
  readonly entryType = 'tool';
  public dataSource: MatTableDataSource<SearchResult<DockstoreTool | AppTool>>;
  constructor(dateService: DateService, searchQuery: SearchQuery, searchService: SearchService) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): Observable<Array<SearchResult<DockstoreTool | AppTool>>> {
    return this.searchQuery.tools$;
  }
  protected readonly TopicSelectionEnum = TopicSelectionEnum;
}
