import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { ContainerService } from './../../shared/container.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject;
  @Input() refreshMessage;
  @Output() selectEntry: EventEmitter<any> = new EventEmitter();

  public toolId$: Observable<number>;
  activeTab = 0;

  constructor(private toolService: ContainerService) { }

  ngOnInit(): void {
    this.toolId$ = this.toolService.toolId$;
  }

  selectTool(tool: ExtendedDockstoreTool): void {
    this.selectEntry.emit(tool);
  }
}
