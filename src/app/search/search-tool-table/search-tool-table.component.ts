import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { map, takeUntil } from 'rxjs/operators';

import { ListContainersService } from '../../containers/list/list.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { DockstoreTool } from '../../shared/swagger';
import { SearchService } from '../search.service';
import { SearchEntryTable } from '../search-entry-table';

@Component({
  selector: 'app-search-tool-table',
  templateUrl: './search-tool-table.component.html',
  styleUrls: ['./search-tool-table.component.scss']
})
export class SearchToolTableComponent extends SearchEntryTable implements OnInit {
  public dataSource: MatTableDataSource<DockstoreTool>;
  public displayedColumns = ['name', 'starredUsers', 'author', 'descriptorType', 'projectLinks', 'dockerPull'];
  constructor(private dockstoreService: DockstoreService, protected dateService: DateService, private searchService: SearchService,
    private listContainersService: ListContainersService) {
      super(dateService);
  }

  privateNgOnInit(): void {
    this.searchService.toolhit$.pipe(map((elasticSearchResults: Array<any>) => {
      if (elasticSearchResults) {
        return elasticSearchResults.map(elasticSearchResult => elasticSearchResult._source);
      }
    }), takeUntil(this.ngUnsubscribe)).subscribe((entries: Array<DockstoreTool>) => {
      if (entries) {
        this.dataSource.data = entries;
      }
    });
  }

  /**
   * This gets the docker pull command
   *
   * @param {string} path The path of the tool (quay.io/namespace/toolname)
   * @param {string} [tagName=''] The specific version of the docker image to get
   * @returns {string} The docker pull command
   * @memberof SearchToolTableComponent
   */
  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.tags);
  }

}
