import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { WorkflowService } from './../../shared/workflow.service';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject;
  @Input() refreshMessage;
  public workflowId$: Observable<number>;
  activeTab = 0;

  constructor(private workflowService: WorkflowService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.workflowId$ = this.workflowService.workflowId$;
  }
}
