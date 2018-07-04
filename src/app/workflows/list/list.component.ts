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
import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject, Subscription } from 'rxjs';

import { CommunicatorService } from '../../shared/communicator.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ListService } from '../../shared/list.service';
import { PageInfo } from '../../shared/models/PageInfo';
import { PagenumberService } from '../../shared/pagenumber.service';
import { ProviderService } from '../../shared/provider.service';
import { WorkflowsService } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { WorkflowService } from '../../shared/workflow.service';
import { PublishedWorkflowsDataSource } from './published-workflows.datasource';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent extends ToolLister {
  @Input() previewMode: boolean;
  @Input() entryType: string;
  dataSource: PublishedWorkflowsDataSource;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  public verifiedLink: string;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  public displayedColumns = ['repository', 'stars', 'author', 'format', 'projectLinks'];
  public length$: Observable<number>;

  constructor(private communicatorService: CommunicatorService,
    private workflowService: WorkflowService,
    private dockstoreService: DockstoreService,
    private pagenumberService: PagenumberService,
    private workflowsService: WorkflowsService,
    dateService: DateService,
    private privateProviderService: ProviderService,
    listService: ListService, providerService: ProviderService) {
    super(listService, providerService, 'workflows', dateService);
  }

  privateOnInit() {
    this.dataSource = new PublishedWorkflowsDataSource(this.workflowsService, this.privateProviderService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getVerified(workflow) {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
