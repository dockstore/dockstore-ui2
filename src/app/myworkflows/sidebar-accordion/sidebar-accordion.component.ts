import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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

  constructor(private workflowQuery: WorkflowQuery,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.workflowId$ = this.workflowQuery.workflowId$;
  }
}
