import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DockstoreTool } from '../../shared/swagger';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

/**
 * this component refers to search page not tool listing search
 */

@Component({
  selector: 'app-search-tool-table',
  templateUrl: './search-tool-table.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './search-tool-table.component.scss']
})
export class SearchToolTableComponent extends SearchEntryTable implements OnInit {
  public dataSource: MatTableDataSource<DockstoreTool>;
  constructor(
    private dockstoreService: DockstoreService,
    dateService: DateService,
    searchQuery: SearchQuery,
    searchService: SearchService
  ) {
    super(dateService, searchQuery, searchService);
  }

  privateNgOnInit(): Observable<Array<DockstoreTool>> {
    return this.searchQuery.tools$;
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.workflowVersions);
  }
}
