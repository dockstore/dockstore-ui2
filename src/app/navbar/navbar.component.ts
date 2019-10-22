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
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Logout } from '../loginComponents/logout';
import { toExtendSite } from '../shared/helpers';
import { UserQuery } from '../shared/user/user.query';
import { LogoutService } from './../shared/logout.service';
import { PageInfo } from './../shared/models/PageInfo';
import { PagenumberService } from './../shared/pagenumber.service';
import { User } from './../shared/swagger/model/user';
import { TrackLoginService } from './../shared/track-login.service';
import { Dockstore } from '../shared/dockstore.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent extends Logout implements OnInit {
  public user: User;
  extendedUser: any;
  isExtended = false;
  Dockstore = Dockstore;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private currentTOSVersion: User.TosversionEnum = User.TosversionEnum.TOSVERSION1;
  private currentPrivacyPolicyVersion: User.PrivacyPolicyVersionEnum = User.PrivacyPolicyVersionEnum.PRIVACYPOLICYVERSION25;

  constructor(
    private pagenumberService: PagenumberService,
    trackLoginService: TrackLoginService,
    logoutService: LogoutService,
    router: Router,
    private userQuery: UserQuery
  ) {
    super(trackLoginService, logoutService, router);
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.isExtended = toExtendSite(this.router.url);
      });
  }

  ngOnInit() {
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      this.user = user;
      if (this.user && (user.privacyPolicyVersion !== this.currentPrivacyPolicyVersion || user.tosversion !== this.currentTOSVersion)) {
        this.logOutUsersWithoutCurrentTOS();
      }
    });
    this.userQuery.extendedUserData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(extendedUser => (this.extendedUser = extendedUser));
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

  logOutUsersWithoutCurrentTOS() {
    this.logout('/session-expired');
  }
}
