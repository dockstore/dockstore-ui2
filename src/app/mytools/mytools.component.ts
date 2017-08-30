import { UsersService } from './../shared/swagger/api/users.service';
import { HttpService } from './../shared/http.service';
import { Configuration } from './../shared/swagger/configuration';
import { Tool } from './../container/register-tool/tool';
import { RegisterToolService } from './../container/register-tool/register-tool.service';
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
  private registerTool: Tool;
  constructor(private mytoolsService: MytoolsService, private configuration: Configuration, private httpService: HttpService,
    private communicatorService: CommunicatorService, private usersService: UsersService,
    private userService: UserService,
    private containerService: ContainerService,
    private refreshService: RefreshService,
    private registerToolService: RegisterToolService) {}
  ngOnInit() {
    this.configuration.accessToken = this.httpService.getDockstoreToken();
    this.containerService.setTool(null);
    this.containerService.tool$.subscribe(selectedTool => {
      this.tool = selectedTool;
      this.communicatorService.setTool(selectedTool);
      this.setIsFirstOpen();
    });
    this.usersService.getUser().subscribe(user => {
      this.user = user;
      this.usersService.userContainers(user.id).subscribe(tools => {
        this.containerService.setTools(tools);
      });
    });
    this.containerService.tools$.subscribe(tools => {
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
      } else {
        this.selectContainer(null);
      }
    });
    this.registerToolService.tool.subscribe(tool => this.registerTool = tool);
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

  setModalGitPathAndImgPath(namespace: string) {
    const namespaceArray = namespace.split('/');
    const path = namespaceArray[1] + '/new_tool';
    this.registerTool.gitPath = path;
    this.registerTool.imagePath = path;
    this.registerToolService.setTool(this.registerTool);
  }

  showRegisterToolModal() {
    this.registerToolService.setIsModalShown(true);
  }

  refreshAllTools() {
    this.refreshService.refreshAllTools(this.user.id);
  }
}
