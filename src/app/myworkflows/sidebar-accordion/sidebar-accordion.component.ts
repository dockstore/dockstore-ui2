import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

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

  constructor(private registerWorkflowModalService: RegisterWorkflowModalService, private workflowService: WorkflowService) { }

  ngOnInit(): void {
    this.workflowId$ = this.workflowService.workflowId$;
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    this.registerWorkflowModalService.setIsModalShown(true);
  }
}
