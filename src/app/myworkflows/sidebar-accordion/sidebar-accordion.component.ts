import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
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

interface groupEntriesBySource {
  groupEntryInfo: OrgWorkflowObject<Workflow>[];
  sourceControlTitle: string;
}

@Component({
  selector: 'app-workflow-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss'],
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgWorkflowObject<Workflow>[];
  @Input() refreshMessage;
  public workflowId$: Observable<number>;
  activeTab = 0;
  entryType$: Observable<EntryType>;
  EntryType = EntryType;
  public isRefreshing$: Observable<boolean>;

  public sortedWorkflows: groupEntriesBySource[] = [
    {
      groupEntryInfo: [],
      sourceControlTitle: 'DOCKSTORE.ORG',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'GITHUB.COM',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'GITLAB.COM',
    },
    {
      groupEntryInfo: [],
      sourceControlTitle: 'BITBUCKET.ORG',
    },
  ];

  constructor(
    private workflowQuery: WorkflowQuery,
    public dialog: MatDialog,
    private sessionQuery: SessionQuery,
    private alertQuery: AlertQuery
  ) {}

  /**
   * Sort workflows by source control to display by groups
   */
  public sortBySourceControl() {
    this.groupEntriesObject.forEach((groupEntryObject) => {
      if (groupEntryObject.sourceControl === 'dockstore.org') {
        this.sortedWorkflows[0].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.sourceControl === 'github.com') {
        this.sortedWorkflows[1].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.sourceControl === 'gitlab.org') {
        this.sortedWorkflows[2].groupEntryInfo.push(groupEntryObject);
      } else if (groupEntryObject.sourceControl === 'bitbucket.org') {
        this.sortedWorkflows[3].groupEntryInfo.push(groupEntryObject);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.groupEntriesObject && this.groupEntriesObject) {
      for (var index in this.sortedWorkflows) {
        this.sortedWorkflows[index].groupEntryInfo = [];
      }
      this.sortBySourceControl();
    }
  }

  ngOnInit(): void {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.entryType$ = this.sessionQuery.entryType$;
    this.workflowId$ = this.workflowQuery.workflowId$;
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
