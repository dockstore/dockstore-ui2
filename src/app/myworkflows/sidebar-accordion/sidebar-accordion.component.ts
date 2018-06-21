import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent {
  @Input() oneAtATime;
  @Input() groupEntriesObject;
  @Output() entrySelected = new EventEmitter<any>();
  constructor() { }

  selectEntry(entry: any): void {
    this.entrySelected.emit(entry);
  }

}
