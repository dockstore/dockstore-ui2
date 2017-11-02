/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { UsersService } from './../shared/swagger/api/users.service';
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
export class NavbarComponent extends Logout implements OnInit {
  public user: User;
  constructor(private pagenumberService: PagenumberService,
    trackLoginService: TrackLoginService,
    logoutService: LogoutService,
    router: Router,
    private userService: UserService) {
    super(trackLoginService, logoutService, router);
  }

  ngOnInit() {
    this.userService.user$.subscribe(user => this.user = user);
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
