import {Component} from '@angular/core';
import {CommunicatorService} from '../shared/communicator.service';
import {DockstoreService} from '../shared/dockstore.service';
import {MytoolsService} from './mytools.service';
import {UserService} from '../loginComponents/user.service';
import {ToolObservableService} from '../shared/tool-observable.service';

@Component({
  selector: 'app-mytools',
  templateUrl: './mytools.component.html',
  styleUrls: ['./mytools.component.css'],
  providers: [MytoolsService, DockstoreService]
})
export class MyToolsComponent {
  nsContainers = [];
  oneAtATime = true;
  constructor(private mytoolsService: MytoolsService,
              private communicatorService: CommunicatorService,
              private userService: UserService,
              private toolObsService: ToolObservableService) {
    userService.getUser().subscribe(user => {
      userService.getUserTools(user.id).subscribe(tools => {
        this.nsContainers = this.mytoolsService.sortNSContainers(tools, user.username);
        const theFirstTool = this.nsContainers[0].containers[0];
        this.selectContainer(theFirstTool);
        this.communicatorService.setTool(theFirstTool);
      });
    });
  }

  selectContainer(tool) {
    this.toolObsService.setTool(tool);
  }
}
