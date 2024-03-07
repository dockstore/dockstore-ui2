import { Component, OnInit } from '@angular/core';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { AppTool, DockstoreTool } from '../../shared/openapi';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery, SearchResult } from '../state/search.query';
import { SearchService } from '../state/search.service';
import TopicSelectionEnum = DockstoreTool.TopicSelectionEnum;

/**
 * this component refers to search page not tool listing search
 */

@Component({
  selector: 'app-search-tool-table',
  templateUrl: './search-tool-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-tool-table.component.scss'],
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
