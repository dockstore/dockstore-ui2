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
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { Logout } from '../loginComponents/logout';
import { Dockstore } from '../shared/dockstore.model';
import { toExtendSite } from '../shared/helpers';
import { UserQuery } from '../shared/user/user.query';
import { LogoutService } from './../shared/logout.service';
import { PageInfo } from './../shared/models/PageInfo';
import { PagenumberService } from './../shared/pagenumber.service';
import { User } from './../shared/openapi/model/user';
import { TrackLoginService } from './../shared/track-login.service';
import { Organization, OrganizationUser, UserNotification } from '../shared/openapi';
import { RequestsQuery } from '../loginComponents/state/requests.query';
import { RequestsService } from '../loginComponents/state/requests.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatButtonModule } from '@angular/material/button';
import { ExtendedModule } from '@ngbracket/ngx-layout/extended';
import { NgClass, NgIf, NgTemplateOutlet, AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { NotificationsService } from 'app/notifications/state/notifications.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    NgClass,
    ExtendedModule,
    RouterLink,
    MatButtonModule,
    RouterLinkActive,
    NgIf,
    FlexModule,
    MatIconModule,
    MatBadgeModule,
    NgTemplateOutlet,
    MatMenuModule,
    AsyncPipe,
  ],
})
export class NavbarComponent extends Logout implements OnInit {
  public user: User;
  extendedUser: any;
  isExtended = false;
  Dockstore = Dockstore;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  public myOrganizationInvites$: Observable<Array<OrganizationUser>>;
  public myRejectedOrganizationRequests$: Observable<Array<OrganizationUser>>;
  public allPendingOrganizations$: Observable<Array<Organization>>;
  public isAdminOrCurator$: Observable<boolean>;
  public notificationCount$: Observable<number>;
  public userNotificationsResponse$: Observable<HttpResponse<UserNotification[]>>;
  public userNotificationsCount: number;

  constructor(
    private pagenumberService: PagenumberService,
    trackLoginService: TrackLoginService,
    logoutService: LogoutService,
    router: Router,
    private userQuery: UserQuery,
    private requestsQuery: RequestsQuery,
    private requestsService: RequestsService,
    private notificationsService: NotificationsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
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
    iconRegistry.addSvgIcon('organization', sanitizer.bypassSecurityTrustResourceUrl('../assets/svg/sub-nav/organization.svg'));
  }

  ngOnInit() {
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
      this.user = user;
      if (user) {
        // You may not be logged in
        this.requestsService.updateMyMemberships();
        if (user.curator || user.isAdmin) {
          this.requestsService.updateCuratorOrganizations();
        }
      } else {
        // In case you went from logged in to logged out
        this.requestsService.updateMyMembershipState(null, null, null, null);
      }
    });
    this.userQuery.extendedUserData$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((extendedUser) => (this.extendedUser = extendedUser));
    this.myOrganizationInvites$ = this.requestsQuery.myOrganizationInvites$;
    this.myRejectedOrganizationRequests$ = this.requestsQuery.myRejectedOrganizationRequests$;
    this.allPendingOrganizations$ = this.requestsQuery.allPendingOrganizations$;
    this.userNotificationsResponse$ = this.notificationsService.getUserNotifications(0, 1);
    this.notificationCount$ = combineLatest([
      this.myOrganizationInvites$,
      this.myRejectedOrganizationRequests$,
      this.allPendingOrganizations$,
      this.userNotificationsResponse$,
      this.isAdminOrCurator$,
    ]).pipe(
      takeUntil(this.ngUnsubscribe),
      map(
        ([invites, rejections, pendingOrganizations, userNotificationsResponse, isAdminOrCurator]: [
          Array<OrganizationUser>,
          Array<OrganizationUser>,
          Array<Organization>,
          HttpResponse<UserNotification[]>,
          boolean
        ]) => {
          this.userNotificationsCount = Number(userNotificationsResponse.headers.get('X-total-count'));
          let count = (invites?.length ?? 0) + (rejections?.length ?? 0) + this.userNotificationsCount;
          if (isAdminOrCurator) {
            return count + (pendingOrganizations?.length ?? 0);
          } else {
            return count;
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
