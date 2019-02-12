/*
 *    Copyright 2017 OICR
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
import { Component, Input, OnInit } from '@angular/core';

import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ListService } from '../../shared/list.service';
import { PagenumberService } from '../../shared/pagenumber.service';
import { ProviderService } from '../../shared/provider.service';
import { PaginatorQuery } from '../../shared/state/paginator.query';
import { PaginatorService } from '../../shared/state/paginator.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { ListContainersService } from './list.service';
import { PublishedToolsDataSource } from './published-tools.datasource';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html'
})
export class ListContainersComponent extends ToolLister implements OnInit {
  @Input() previewMode: boolean;

  public displayedColumns = ['name', 'author', 'format', 'projectLinks', 'stars', 'dockerPull'];
  type: 'tool' | 'workflow' = 'tool';
  constructor(private listContainersService: ListContainersService,
    private dockstoreService: DockstoreService,
    private imageProviderService: ImageProviderService,
    private pagenumberService: PagenumberService,
    private containersService: ContainersService,
    protected providerService: ProviderService,
    listService: ListService, paginatorService: PaginatorService,
    dateService: DateService, private paginatorQuery: PaginatorQuery
  ) {
    super(listService, paginatorService, providerService, dateService);
  }
  ngOnInit() {
    this.pageSize$ = this.paginatorQuery.toolPageSize$;
    this.pageIndex$ = this.paginatorQuery.toolPageIndex$;
    this.dataSource = new PublishedToolsDataSource(this.containersService, this.providerService, this.imageProviderService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  /**
   * This gets the docker pull command
   *
   * @param {string} path The path of the tool (quay.io/namespace/toolname)
   * @param {string} [tagName=''] The specific version of the docker image to get
   * @returns {string} The docker pull command
   * @memberof ListContainersComponent
   */
  getFilteredDockerPullCmd(path: string, tagName: string = ''): string {
    return this.listContainersService.getDockerPullCmd(path, tagName);
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.tags);
  }
}
