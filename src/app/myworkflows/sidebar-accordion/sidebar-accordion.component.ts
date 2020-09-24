import { Component, Input, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-sidebar-accordion',
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
  constructor(
    private workflowQuery: WorkflowQuery,
    public dialog: MatDialog,
    private sessionQuery: SessionQuery,
    private alertQuery: AlertQuery
  ) {}

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
