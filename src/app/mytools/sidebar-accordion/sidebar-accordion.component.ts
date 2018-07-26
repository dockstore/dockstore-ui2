import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { Tool } from './../../container/register-tool/tool';
import { ContainerService } from './../../shared/container.service';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';

@Component({
  selector: 'app-sidebar-accordion',
  templateUrl: './sidebar-accordion.component.html',
  styleUrls: ['./sidebar-accordion.component.scss']
})
export class SidebarAccordionComponent implements OnInit {
  @Input() openOneAtATime;
  @Input() groupEntriesObject;
  public toolId$: Observable<number>;
  private registerTool: Tool;
  activeTab = 0;

  constructor(private toolService: ContainerService, private registerToolService: RegisterToolService, private router: Router) { }

  ngOnInit(): void {
    this.toolId$ = this.toolService.toolId$;
    this.registerToolService.tool.subscribe(tool => this.registerTool = tool);
  }

  setRegisterEntryModalInfo(namespace: string): void {
    const namespaceArray = namespace.split('/');
    const path = namespaceArray[1] + '/new_tool';
    this.registerTool.gitPath = path;
    this.registerTool.imagePath = path;
    this.registerToolService.setTool(this.registerTool);
  }

  showRegisterEntryModal(): void {
    this.registerToolService.setIsModalShown(true);
  }

  selectEntry(tool: ExtendedDockstoreTool): void {
    this.toolService.setTool(tool);
    if (tool) {
      this.router.navigateByUrl('/my-tools/' + tool.tool_path);
    }
  }
}
