import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { takeUntil } from 'rxjs/operators';
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
  styleUrls: ['./search-tool-table.component.scss']
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

  privateNgOnInit(): void {
    this.searchQuery.tools$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entries: Array<DockstoreTool>) => {
      if (entries) {
        this.dataSource.data = entries;
      }
    });
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.workflowVersions);
  }
}
