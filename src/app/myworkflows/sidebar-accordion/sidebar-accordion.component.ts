/*
 *    Copyright 2022 OICR, UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertQuery } from 'app/shared/alert/state/alert.query';
import { bootstrap4extraLargeModalSize } from 'app/shared/constants';
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionQuery } from 'app/shared/session/session.query';
import { Workflow } from 'app/shared/openapi';
import { Observable } from 'rxjs';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { OrgWorkflowObject } from '../my-workflow/my-workflow.component';
import { GithubAppsLogsComponent } from './github-apps-logs/github-apps-logs.component';
import { KeyValue, NgFor, NgIf, NgClass, NgTemplateOutlet, AsyncPipe, KeyValuePipe } from '@angular/common';
import { MetadataService } from '../../shared/openapi/api/metadata.service';
import { SelectTabPipe } from '../../shared/entry/select-tab.pipe';
import { RefreshWorkflowOrganizationComponent } from '../../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';

interface GroupEntriesBySource {
  groupEntryInfo: OrgWorkflowObject<Workflow>[];
  sourceControlTitle: string;
}

@Component({
  selector: 'app-workflow-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: [
    './sidebar-accordion.component.scss',
    '../../mytools/sidebar-accordion/sidebar-accordion.component.scss',
    '../../shared/styles/my-entry-sidebar.scss',
  ],
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    MatExpansionModule,
    MatTabsModule,
    ExtendedModule,
    NgClass,
    NgTemplateOutlet,
    MatListModule,
    MatIconModule,
    RouterLink,
    FlexModule,
    MatButtonModule,
    RefreshWorkflowOrganizationComponent,
    AsyncPipe,
    KeyValuePipe,
    SelectTabPipe,
  ],
})
export class SidebarAccordionComponent implements OnInit, OnChanges {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgWorkflowObject<Workflow>[];
  @Input() refreshMessage;
  @Input() pageEntryType: EntryType;
  public workflowId$: Observable<number>;
  activeTab = 0;
  entryType$: Observable<EntryType>;
  EntryType = EntryType;
  isTool$: Observable<boolean>;
  public isRefreshing$: Observable<boolean>;
  public sourceControlToWorkflows: Map<string, GroupEntriesBySource> = new Map<string, GroupEntriesBySource>();

  constructor(
    private workflowQuery: WorkflowQuery,
    public dialog: MatDialog,
    private sessionQuery: SessionQuery,
    private alertQuery: AlertQuery,
    private metadataService: MetadataService
  ) {
    this.metadataService.getSourceControlList().subscribe((map) => {
      map.forEach((source) => {
        this.sourceControlToWorkflows.set(source.value, { groupEntryInfo: [], sourceControlTitle: source.friendlyName.toUpperCase() });
      });
      this.sortBySourceControl();
    });
  }

  /**
   * Display in original ordering when iterating through keys
   */
  public defaultOrdering(_left: KeyValue<string, GroupEntriesBySource>, _right: KeyValue<string, GroupEntriesBySource>): number {
    return 0;
  }

  /**
   * Sort workflows by source control to display by groups
   */
  public sortBySourceControl() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      this.sourceControlToWorkflows.get(groupEntryObject.sourceControl).groupEntryInfo.push(groupEntryObject);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (const key of this.sourceControlToWorkflows.keys()) {
        this.sourceControlToWorkflows.get(key).groupEntryInfo = [];
      }
      if (this.sourceControlToWorkflows.size != 0) {
        this.sortBySourceControl();
      }
    }
  }

  ngOnInit(): void {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.entryType$ = this.sessionQuery.entryType$;
    this.workflowId$ = this.workflowQuery.workflowId$;
    this.isTool$ = this.sessionQuery.isTool$;
  }

  trackByWorkflowId(index: number, workflow: Workflow) {
    return workflow.id;
  }

  trackByOrgWorkflowObject(index: number, orgWorkflowObject: OrgWorkflowObject<Workflow>) {
    return orgWorkflowObject.sourceControl + '/' + orgWorkflowObject.organization;
  }

  openGitHubAppsLogs(organization: string) {
    this.dialog.open(GithubAppsLogsComponent, { width: bootstrap4extraLargeModalSize, data: { organization: organization } });
  }
}
