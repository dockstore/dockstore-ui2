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
  selContainerObj: any;
  tools: any;
  user: any;
  constructor(private mytoolsService: MytoolsService,
    private communicatorService: CommunicatorService,
    private userService: UserService,
    private containerService: ContainerService) {

  }
  ngOnInit() {
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
      if (this.nsContainers) {
        const theFirstTool = this.nsContainers[0].containers[0];
        this.selectContainer(theFirstTool);
        this.containerService.setTool(theFirstTool);
        this.communicatorService.setTool(theFirstTool);
      }
    }
    );
  }
  selectContainer(tool) {
    this.selContainerObj = tool;
    this.containerService.setTool(tool);
    this.communicatorService.setTool(tool);
  }
}
