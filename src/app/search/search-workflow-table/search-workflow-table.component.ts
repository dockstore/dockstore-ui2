import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { takeUntil } from 'rxjs/operators';

import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { Workflow } from '../../shared/swagger';
import { SearchEntryTable } from '../search-entry-table';
import { SearchQuery } from '../state/search.query';
import { SearchService } from '../state/search.service';

@Component({
  selector: 'app-search-workflow-table',
  templateUrl: './search-workflow-table.component.html',
  styleUrls: ['./search-workflow-table.component.scss']
})
export class SearchWorkflowTableComponent extends SearchEntryTable implements OnInit {
  public displayedColumns = ['repository', 'author', 'descriptorType', 'starredUsers', 'projectLinks'];
  public dataSource: MatTableDataSource<Workflow>;
  constructor(private dockstoreService: DockstoreService, protected dateService: DateService, private searchService: SearchService,
    private searchQuery: SearchQuery) {
    super(dateService);
  }

  privateNgOnInit(): void {
    this.searchQuery.workflows$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entries: Array<Workflow>) => {
      if (entries) {
        this.dataSource.data = entries;
      }
    });
  }

  getVerified(workflow: Workflow): boolean {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
