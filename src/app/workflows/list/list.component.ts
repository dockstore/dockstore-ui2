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

import { CommunicatorService } from '../../shared/communicator.service';
import { DateService } from '../../shared/date.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ListService } from '../../shared/list.service';
import { PagenumberService } from '../../shared/pagenumber.service';
import { ProviderService } from '../../shared/provider.service';
import { Workflow, WorkflowsService } from '../../shared/swagger';
import { ToolLister } from '../../shared/tool-lister';
import { WorkflowService } from '../../shared/workflow.service';
import { PublishedWorkflowsDataSource } from './published-workflows.datasource';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html'
})
export class ListWorkflowsComponent extends ToolLister implements OnInit {
  @Input() previewMode: boolean;

  public displayedColumns = ['repository', 'stars', 'author', 'format', 'projectLinks'];

  constructor(private communicatorService: CommunicatorService,
    private workflowService: WorkflowService,
    private dockstoreService: DockstoreService,
    private pagenumberService: PagenumberService,
    private workflowsService: WorkflowsService,
    protected providerService: ProviderService,
    dateService: DateService,
    listService: ListService) {
    super(listService, providerService, dateService);
  }

  ngOnInit() {
    this.dataSource = new PublishedWorkflowsDataSource(this.workflowsService, this.providerService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getVerified(workflow: Workflow): boolean {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
