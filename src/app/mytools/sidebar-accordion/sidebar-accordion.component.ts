import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContainerService } from './../../shared/container.service';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject;
  @Input() refreshMessage;

  public toolId$: Observable<number>;
  activeTab = 0;

  constructor(private toolService: ContainerService) { }

  ngOnInit(): void {
    this.toolId$ = this.toolService.toolId$;
  }
}
