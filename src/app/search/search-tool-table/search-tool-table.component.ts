import { Component, HostListener, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { takeUntil } from 'rxjs/operators';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DockstoreTool } from '../../shared/swagger';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';
import { MatSort } from '@angular/material';

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

  privateNgOnInit(): void {
    this.searchQuery.tools$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entries: Array<DockstoreTool>) => {
      if (entries) {
        this.dataSource.data = entries;
      }
    });
    this.dataSource.sortData = (data: DockstoreTool[], sort: MatSort) => {
      return data.slice().sort((a, b) => {
        return SearchEntryTable.compareAttributes(a, b, sort.active, sort.direction);
      });
    };
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.workflowVersions);
  }
}
