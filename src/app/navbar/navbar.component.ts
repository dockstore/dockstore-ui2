import { User } from './../shared/swagger/model/user';
import { AuthService } from 'ng2-ui-auth';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { LogoutService } from './../shared/logout.service';
import { Logout } from '../loginComponents/logout';
import { TrackLoginService } from './../shared/track-login.service';
import { UserService } from './../loginComponents/user.service';
import { PagenumberService } from './../shared/pagenumber.service';
import { PageInfo } from './../shared/models/PageInfo';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent extends Logout {
  public user: User;
  constructor (private pagenumberService: PagenumberService,
               trackLoginService: TrackLoginService,
               logoutService: LogoutService,
               router: Router,
               userService: UserService) {
    super(trackLoginService, logoutService, router);
    userService.getUser().subscribe(user => userService.setUser(user));
    userService.user$.subscribe(user => {
      this.user = user;
    });
  }
  resetPageNumber() {
    const toolPageInfo: PageInfo = new PageInfo();
    toolPageInfo.pgNumber = 0;
    toolPageInfo.searchQuery = '';

    const workflowPageInfo: PageInfo = new PageInfo();
    workflowPageInfo.pgNumber = 0;
    workflowPageInfo.searchQuery = '';
    this.pagenumberService.setToolsPageInfo(toolPageInfo);
    this.pagenumberService.setWorkflowPageInfo(workflowPageInfo);
  }
}
