import { RefreshService } from './../shared/refresh.service';
import { Component, OnInit } from '@angular/core';
import { CommunicatorService } from '../shared/communicator.service';
import { DockstoreService } from '../shared/dockstore.service';
import { MytoolsService } from './mytools.service';
import { UserService } from '../loginComponents/user.service';
import { ContainerService } from '../shared/container.service';

@Component({
  selector: 'app-mytools',
  templateUrl: './mytools.component.html',
  styleUrls: ['./mytools.component.css'],
  providers: [MytoolsService, DockstoreService]
})
export class MyToolsComponent implements OnInit {
  nsContainers: any;
  oneAtATime = true;
  tools: any;
  user: any;
  tool: any;
  isInit = false;
  constructor(private mytoolsService: MytoolsService,
    private communicatorService: CommunicatorService,
    private userService: UserService,
    private containerService: ContainerService,
    private refreshService: RefreshService) {
  }
  ngOnInit() {
    this.containerService.setTool(null);
    this.containerService.tool$.subscribe(selectedTool => {
      this.tool = selectedTool;
      this.communicatorService.setTool(selectedTool);
      this.setIsFirstOpen();
    });
    this.userService.getUser().subscribe(user => {
      this.user = user;
      this.userService.getUserTools(user.id).subscribe(tools => {
        this.containerService.setTools(tools);
      });
    });
    this.containerService.tools.subscribe(tools => {
      this.tools = tools;
      if (this.user) {
        const sortedContainers = this.mytoolsService.sortNSContainers(tools, this.user.username);
        this.containerService.setNsContainers(sortedContainers);
      }
    });
    this.containerService.nsContainers.subscribe(containers => {
        this.nsContainers = containers;
        /* For the first initial time, set the first tool to be the selected one */
        if (this.nsContainers && this.nsContainers.length > 0) {
          const theFirstTool = this.nsContainers[0].containers[0];
          this.selectContainer(theFirstTool);
      }
    });
  }
  setIsFirstOpen() {
    if (this.nsContainers && this.tool) {
      for (const nsObj of this.nsContainers) {
        if (this.containSelectedTool(nsObj)) {
          nsObj.isFirstOpen = true;
          break;
        }
      }
    }
  }
  containSelectedTool(nsObj) {
    let containTool = false;
    for (const tool of nsObj.containers) {
      if (tool.id === this.tool.id) {
        containTool = true;
        break;
      }
    }
    return containTool;
  }
  selectContainer(tool) {
    this.tool = tool;
    this.containerService.setTool(tool);
    this.communicatorService.setTool(tool);
  }

  refreshAllTools() {
    this.refreshService.refreshAllTools(this.user.id);
  }
}
