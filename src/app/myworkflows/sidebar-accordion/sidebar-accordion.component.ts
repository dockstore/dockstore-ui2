import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { RegisterWorkflowModalComponent } from '../../workflow/register-workflow-modal/register-workflow-modal.component';
import { WorkflowService } from './../../shared/workflow.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';

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

  constructor(private registerWorkflowModalService: RegisterWorkflowModalService, private workflowService: WorkflowService,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    this.workflowId$ = this.workflowService.workflowId$;
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    const dialogRef = this.dialog.open(RegisterWorkflowModalComponent, {width: '600px'});
  }
}
