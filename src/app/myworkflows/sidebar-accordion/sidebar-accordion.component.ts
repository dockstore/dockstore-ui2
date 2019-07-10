import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionQuery } from 'app/shared/session/session.query';
import { Observable } from 'rxjs';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { OrgWorkflowObject } from '../my-workflow/my-workflow.component';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgWorkflowObject[];
  @Input() refreshMessage;
  public workflowId$: Observable<number>;
  activeTab = 0;
  entryType$: Observable<EntryType>;
  EntryType = EntryType;
  constructor(private workflowQuery: WorkflowQuery, public dialog: MatDialog, private sessionQuery: SessionQuery) {}

  ngOnInit(): void {
    this.entryType$ = this.sessionQuery.entryType$;
    this.workflowId$ = this.workflowQuery.workflowId$;
  }
}
