import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertQuery } from 'app/shared/alert/state/alert.query';
import { bootstrap4largeModalSize } from 'app/shared/constants';
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionQuery } from 'app/shared/session/session.query';
import { Workflow } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { OrgWorkflowObject } from '../my-workflow/my-workflow.component';
import { GithubAppsLogsComponent } from './github-apps-logs/github-apps-logs.component';
import { KeyValue } from '@angular/common';
import { MetadataService } from '../../shared/swagger/api/metadata.service';

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
})
export class SidebarAccordionComponent implements OnInit, OnChanges {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgWorkflowObject<Workflow>[];
  @Input() refreshMessage;
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
    this.dialog.open(GithubAppsLogsComponent, { width: bootstrap4largeModalSize, data: organization });
  }
}
