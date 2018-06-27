import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent {
  @Input() openOneAtATime;
  @Input() groupEntriesObject;
  @Output() entrySelected = new EventEmitter<any>();
  constructor(private registerWorkflowModalService: RegisterWorkflowModalService) { }

  selectEntry(entry: any): void {
    this.entrySelected.emit(entry);
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    this.registerWorkflowModalService.setIsModalShown(true);
  }
}
