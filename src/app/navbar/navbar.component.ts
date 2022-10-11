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
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Logout } from '../loginComponents/logout';
import { currentPrivacyPolicyVersion, currentTOSVersion } from '../shared/constants';
import { Dockstore } from '../shared/dockstore.model';
import { toExtendSite } from '../shared/helpers';
import { UserQuery } from '../shared/user/user.query';
import { LogoutService } from './../shared/logout.service';
import { PageInfo } from './../shared/models/PageInfo';
import { PagenumberService } from './../shared/pagenumber.service';
import { User } from './../shared/swagger/model/user';
import { TrackLoginService } from './../shared/track-login.service';
import { Organization, OrganizationUser } from '../shared/swagger';
import { RequestsQuery } from '../loginComponents/state/requests.query';
import { RequestsService } from '../loginComponents/state/requests.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent extends Logout implements OnInit {
  public user: User;
  extendedUser: any;
  isExtended = false;
  Dockstore = Dockstore;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  private readonly currentTOSVersion: User.TosversionEnum = currentTOSVersion;
  private readonly currentPrivacyPolicyVersion: User.PrivacyPolicyVersionEnum = currentPrivacyPolicyVersion;
  public myOrganizationInvites$: Observable<Array<OrganizationUser>>;
  public myRejectedOrganizationRequests$: Observable<Array<OrganizationUser>>;
  public allPendingOrganizations$: Observable<Array<Organization>>;
  public isAdminOrCurator$: Observable<boolean>;
  public notificationCount$: Observable<number>;

  constructor(
    private pagenumberService: PagenumberService,
    trackLoginService: TrackLoginService,
    logoutService: LogoutService,
    router: Router,
    private userQuery: UserQuery,
    private requestsQuery: RequestsQuery,
    private requestsService: RequestsService
  ) {
    super(trackLoginService, logoutService, router);
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.isExtended = toExtendSite(this.router.url);
      });
    this.isAdminOrCurator$ = this.userQuery.isAdminOrCurator$;
  }

  ngOnInit() {
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
      this.user = user;
      this.requestsService.updateMyMemberships();
      this.requestsService.updateCuratorOrganizations();
    });
    this.userQuery.extendedUserData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((extendedUser) => (this.extendedUser = extendedUser));
    this.myOrganizationInvites$ = this.requestsQuery.myOrganizationInvites$;
    this.myRejectedOrganizationRequests$ = this.requestsQuery.myRejectedOrganizationRequests$;
    this.allPendingOrganizations$ = this.requestsQuery.allPendingOrganizations$;
    this.notificationCount$ = combineLatest([
      this.myOrganizationInvites$,
      this.myRejectedOrganizationRequests$,
      this.allPendingOrganizations$,
      this.isAdminOrCurator$,
    ]).pipe(
      takeUntil(this.ngUnsubscribe),
      map(
        ([invites, rejections, pendingOrganizations, isAdminOrCurator]: [
          Array<OrganizationUser>,
          Array<OrganizationUser>,
          Array<Organization>,
          boolean
        ]) => {
          let count = invites?.length + rejections?.length;
          if (isAdminOrCurator) {
            return isNaN(count + pendingOrganizations?.length) ? 0 : count + pendingOrganizations?.length;
          } else {
            return isNaN(count) ? 0 : count;
          }
        }
      )
    );
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
