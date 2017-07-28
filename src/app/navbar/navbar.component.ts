
import { AuthService } from 'ng2-ui-auth';
import { Component, OnInit, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import { LogoutService } from './../shared/logout.service';
import { Logout } from '../loginComponents/logout';
import { TrackLoginService } from './../shared/track-login.service';
import { UserService } from './../loginComponents/user.service';
import { PagenumberService } from './../shared/pagenumber.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent extends Logout {
  private user;
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
    this.pagenumberService.setToolsPageNumber(0);
    this.pagenumberService.setWorkflowPageNumber(0);
  }
}
