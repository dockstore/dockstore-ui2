import { Component, OnInit } from '@angular/core';
import { RecentEventsQuery } from 'app/home-page/state/recent-events.query';
import { RecentEventsService } from 'app/home-page/state/recent-events.service';
import { RecentEventsStore } from 'app/home-page/state/recent-events.store';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequestsService } from 'app/loginComponents/state/requests.service';
import { EventsQuery } from 'app/organizations/state/events.query';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { User, Event, Organization, OrganizationUser, EventsService } from 'app/shared/openapi';
import { EntriesService, UsersService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-organization-box',
  templateUrl: '/organization-box.component.html',
  styleUrls: ['/organization-box.component.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<Organization> = [];
  events: Array<Event> = [];
  firstCall = true;
  hasOrganizations = false;
  user: User;
  username: string;
  readonly supportedEventTypes = [
    Event.TypeEnum.CREATECOLLECTION,
    Event.TypeEnum.ADDTOCOLLECTION,
    Event.TypeEnum.ADDUSERTOORG,
    Event.TypeEnum.MODIFYCOLLECTION,
  ];
  pendingRequests: Array<OrganizationUser> = [];
  pendingInvites: Array<OrganizationUser> = [];
  EventType = Event.TypeEnum;

  public isLoading = true;

  constructor(
    protected userQuery: UserQuery,
    protected usersService: UsersService,
    protected entriesService: EntriesService,
    private requestsQuery: RequestsQuery,
    private eventsService: EventsService
  ) {
    super();
    this.user = this.userQuery.getValue().user;
  }

  ngOnInit(): void {
    this.getMyOrganizations();
    this.requestsQuery.myPendingOrganizationRequests$.subscribe((requests) => {
      if (requests) {
        this.pendingRequests = requests;
      }
    });
    this.requestsQuery.myOrganizationInvites$.subscribe((invites) => {
      if (invites) {
        this.pendingRequests = invites;
      }
    });
  }

  getMyOrganizations() {
    this.username = this.user.username;
    // this.recentEventsService.getOrganizations();
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.listOfOrganizations = starredOrganizations;
    });
    this.eventsService
      .getEvents('STARRED_ORGANIZATION', 5)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((events) => {
        this.events = events;
        console.log(events);
      });
    this.isLoading = false;
  }
}
