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
import { SessionQuery } from 'app/shared/session/session.query';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ProviderService } from '../../shared/provider.service';
import { PaginatorQuery } from '../../shared/state/paginator.query';
import { PaginatorService } from '../../shared/state/paginator.service';
import { ContainersService, DockstoreTool } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { PublishedToolsDataSource } from './published-tools.datasource';

@Component({
  selector: 'app-list-containers',
  templateUrl: './list.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './list.component.scss']
})
export class ListContainersComponent extends ToolLister implements OnInit {
  @Input() previewMode: boolean;

  public displayedColumns = ['name', 'verified', 'author', 'format', 'projectLinks', 'stars'];
  type: 'tool' | 'workflow' = 'tool';
  constructor(
    private dockstoreService: DockstoreService,
    private imageProviderService: ImageProviderService,
    private containersService: ContainersService,
    protected providerService: ProviderService,
    protected workflowQuery: WorkflowQuery,
    protected sessionQuery: SessionQuery,
    paginatorService: PaginatorService,
    dateService: DateService,
    private paginatorQuery: PaginatorQuery
  ) {
    super(paginatorService, providerService, dateService, sessionQuery);
  }
  ngOnInit() {
    this.pageSize$ = this.paginatorQuery.toolPageSize$;
    this.pageIndex$ = this.paginatorQuery.toolPageIndex$;
    this.dataSource = new PublishedToolsDataSource(this.containersService, this.providerService, this.imageProviderService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getVerified(tool: DockstoreTool): boolean {
    return this.dockstoreService.getVersionVerified(tool.workflowVersions);
  }
}
