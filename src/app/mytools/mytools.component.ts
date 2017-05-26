import { Component, OnInit } from '@angular/core';
import { UserService } from '../loginComponents/user.service';
import { MytoolsService } from './mytools.service';
import { ListService } from '../shared/list.service';
import { ProviderService } from '../shared/provider.service';
import { CommunicatorService } from '../shared/communicator.service';

@Component({
  selector: 'app-mytools',
  templateUrl: './mytools.component.html',
  styleUrls: ['./mytools.component.css'],
  providers: [MytoolsService, ListService,
              ProviderService, UserService]
})
export class MyToolsComponent {
  user;
  userTools = [];
  nsContainers = [];
  constructor(private listService: ListService,
              private mytoolsService: MytoolsService,
              private communicatorService: CommunicatorService,
              private providerService: ProviderService,
              private userService: UserService) {
    this.userService.getUser().subscribe(user => {
      this.user = user;
      console.log(user);
      this.userService.getUserTools(user.id).subscribe(tools => {
        this.userTools = tools;
        console.log(this.userTools);
        this.sendToolInfo(this.userTools[0]);
        console.log(user.username);
        this.nsContainers = this.mytoolsService.sortNSContainers(tools, user.username);
        console.log(this.nsContainers);
      });
    });
  }
  sendToolInfo(tool) {
    this.communicatorService.setObj(tool);
  }
}
