import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../loginComponents/user.service';
import { MytoolsService } from './mytools.service';
import { ProviderService } from '../shared/provider.service';
import { CommunicatorService } from '../shared/communicator.service';
import { DockstoreService } from '../shared/dockstore.service';

import { Tool } from '../shared/tool';
import { ToolService } from '../shared/tool.service';

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
  constructor(private mytoolsService: MytoolsService,
              private dockstoreService: DockstoreService,
              toolService: ToolService,
              communicatorService: CommunicatorService,
              providerService: ProviderService,
              userService: UserService,
              router: Router
  ) {
    super(toolService, communicatorService, providerService, userService, router, 'mytools');
      userService.getUser().subscribe(user => {
        this.user = user;
        console.log(user);
        userService.getUserTools(user.id).subscribe(tools => {
        this.userTools = tools;
        this.selectContainer(this.userTools[0]);
        this.nsContainers = this.mytoolsService.sortNSContainers(tools, user.username);
        console.log(this.nsContainers);
      });
    });
  }
  selectContainer(tool) {
    this.setToolObj(tool);
    // this.updateTool();
  }
  setProperties() {
  }
  getValidVersions() {
    this.validVersions = this.dockstoreService.getValidVersions(this.tool.tags);
  }
  MYfoo() {
    this.foo();
  }
}
