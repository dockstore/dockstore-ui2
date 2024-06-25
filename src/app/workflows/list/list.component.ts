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
import { Workflow, WorkflowsService } from '../../shared/openapi';
import { ToolLister } from '../../shared/tool-lister';
import { PublishedWorkflowsDataSource } from './published-workflows.datasource';
import { DescriptorLanguagePipe } from '../../shared/entry/descriptor-language.pipe';
import { RouterLinkPipe } from '../../entry/router-link.pipe';
import { MatLegacyPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';
import { MatIconModule } from '@angular/material/icon';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { RouterLink } from '@angular/router';
import { MatSortModule } from '@angular/material/sort';
import { MatLegacyTableModule } from '@angular/material/legacy-table';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyProgressBarModule } from '@angular/material/legacy-progress-bar';
import { NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-list-workflows',
  templateUrl: './list.component.html',
  styleUrls: ['../../shared/styles/entry-table.scss', './list.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatLegacyProgressBarModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyTableModule,
    MatSortModule,
    RouterLink,
    ExtendedModule,
    MatIconModule,
    MatLegacyTooltipModule,
    FontAwesomeModule,
    MatLegacyButtonModule,
    MatLegacyPaginatorModule,
    AsyncPipe,
    TitleCasePipe,
    RouterLinkPipe,
    DescriptorLanguagePipe,
  ],
})
export class ListWorkflowsComponent extends ToolLister<PublishedWorkflowsDataSource> implements OnInit {
  @Input() previewMode: boolean;

  public workflowColumns = ['repository', 'verified', 'author', 'descriptorType', 'projectLinks', 'stars'];
  public notebookColumns = ['repository', 'author', 'descriptorType', 'descriptorTypeSubclass', 'projectLinks', 'stars'];
  public serviceColumns = ['repository', 'verified', 'author', 'projectLinks', 'stars'];
  public typeToDisplayedColumns = {
    workflow: this.workflowColumns,
    service: this.serviceColumns,
    appTool: this.workflowColumns,
    notebook: this.notebookColumns,
  };
  public entryType$: Observable<EntryType>;
  public entryTypeDisplayName$: Observable<string>;
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
    this.entryTypeDisplayName$ = this.sessionQuery.entryTypeDisplayName$;
    this.pageSize$ = this.paginatorQuery.workflowPageSize$;
    this.pageIndex$ = this.paginatorQuery.workflowPageIndex$;
    this.dataSource = new PublishedWorkflowsDataSource(this.workflowsService, this.providerService);
    this.length$ = this.dataSource.entriesLengthSubject$;
  }

  getVerified(workflow: Workflow): boolean {
    return this.dockstoreService.getVersionVerified(workflow.workflowVersions);
  }
}
