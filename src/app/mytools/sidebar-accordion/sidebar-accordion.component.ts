import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ContainerService } from '../../shared/container.service';
import { OrgToolObject } from '../my-tool/my-tool.component';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject: OrgToolObject[];
  @Input() refreshMessage;

  public toolId$: Observable<number>;
  activeTab = 0;

  constructor(private toolService: ContainerService) { }

  ngOnInit(): void {
    this.toolId$ = this.toolService.toolId$;
  }
}
