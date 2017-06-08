import {Component, ViewChild} from '@angular/core';
import {Router} from '@angular/router';

import {ContainerComponent} from '../container/container.component';
import {CommunicatorService} from '../shared/communicator.service';
import {DockstoreService} from '../shared/dockstore.service';
import {MytoolsService} from './mytools.service';
import {ProviderService} from '../shared/provider.service';
import {Tool} from '../shared/tool';
import {ToolService} from '../shared/tool.service';
import {UserService} from '../loginComponents/user.service';
import { WorkflowObjService } from '../shared/workflow.service';

@Component({
  selector: 'app-mytools',
  templateUrl: './mytools.component.html',
  styleUrls: ['./mytools.component.css'],
  providers: [MytoolsService, DockstoreService]
})
export class MyToolsComponent extends Tool {
  user;
  userTools = [];
  nsContainers = [];
  oneAtATime = true;
  @ViewChild(ContainerComponent) myContainer: ContainerComponent;
  constructor(private dockstoreService: DockstoreService,
              private mytoolsService: MytoolsService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              userService: UserService,
              router: Router,
              workflowObjService: WorkflowObjService
  ) {
    super(toolService, communicatorService, providerService, userService, router, workflowObjService, 'mytools');
      userService.getUser().subscribe(user => {
        this.user = user;
        userService.getUserTools(user.id).subscribe(tools => {
          this.userTools = tools;
          this.nsContainers = this.mytoolsService.sortNSContainers(tools, user.username);
          this.selectContainer(this.nsContainers[0].containers[0]);
      });
    });
  }
  selectContainer(tool) {
    this.tool = tool;
    this.setToolObj(tool);
    this.myContainer.updateData(tool, this.defaultVersion);
  }
  setProperties() {
  }

  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }
}
