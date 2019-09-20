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
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionQuery } from 'app/shared/session/session.query';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { Observable } from 'rxjs';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ProviderService } from '../../shared/provider.service';
import { PaginatorQuery } from '../../shared/state/paginator.query';
import { PaginatorService } from '../../shared/state/paginator.service';
import { Workflow, WorkflowsService } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { PublishedWorkflowsDataSource } from './published-workflows.datasource';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './list.component.scss']
})
export class ListWorkflowsComponent extends ToolLister implements OnInit {
  @Input() previewMode: boolean;

  public displayedColumns = ['repository', 'verified', 'author', 'descriptorType', 'projectLinks', 'stars'];
  public entryType$: Observable<EntryType>;
  type: 'tool' | 'workflow' = 'workflow';
  constructor(
    private dockstoreService: DockstoreService,
    private workflowsService: WorkflowsService,
    protected providerService: ProviderService,
    protected workflowQuery: WorkflowQuery,
    paginatorService: PaginatorService,
    dateService: DateService,
    protected paginatorQuery: PaginatorQuery,
    protected sessionQuery: SessionQuery
  ) {
    super(paginatorService, providerService, dateService, sessionQuery);
  }

  ngOnInit() {
    this.entryType$ = this.sessionQuery.entryType$;
    this.pageSize$ = this.paginatorQuery.workflowPageSize$;
    this.pageIndex$ = this.paginatorQuery.workflowPageIndex$;
    this.dataSource = new PublishedWorkflowsDataSource(this.workflowsService, this.providerService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getVerified(workflow: Workflow): boolean {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
