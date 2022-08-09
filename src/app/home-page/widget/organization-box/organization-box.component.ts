import { Component, OnInit } from '@angular/core';
import { RecentEventsQuery } from 'app/home-page/state/recent-events.query';
import { RecentEventsService } from 'app/home-page/state/recent-events.service';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequestsService } from 'app/loginComponents/state/requests.service';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { User, Event, Organization, OrganizationUser } from 'app/shared/openapi';
import { EntriesService, OrganizationUpdateTime, UsersService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-organization-box',
  templateUrl: '/organization-box.component.html',
  styleUrls: ['/organization-box.component.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<Organization> = [];
  events$: Observable<Event[]>;
  loading$: Observable<boolean>;
  noEvents$: Observable<boolean>;
  filterText: string;
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
  pendingRequests: Array<OrganizationUser>;
  pendingInvites: Array<OrganizationUser>;

  public isLoading = true;

  constructor(
    protected userQuery: UserQuery,
    protected usersService: UsersService,
    protected entriesService: EntriesService,
    private recentEventsService: RecentEventsService,
    private recentEventsQuery: RecentEventsQuery,
    private requestsService: RequestsService,
    private requestsQuery: RequestsQuery
  ) {
    super();
    this.user = this.userQuery.getValue().user;
  }

  ngOnInit(): void {
    this.getMyOrganizations();
    this.requestsQuery.myPendingOrganizationRequests$.subscribe((requests) => {
      this.pendingRequests = requests;
    });
    this.requestsQuery.myOrganizationInvites$.subscribe((invites) => {
      this.pendingInvites = invites;
    });
  }

  getMyOrganizations() {
    this.username = this.user.username;
    this.recentEventsService.getOrganizations();
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.listOfOrganizations = starredOrganizations;
    });
    this.events$ = this.recentEventsQuery.selectAll({
      filterBy: (entity) => this.supportedEventTypes.includes(entity.type),
    });
    this.loading$ = this.recentEventsQuery.selectLoading();
    this.noEvents$ = this.events$.pipe(map((events) => !events || events.length === 0));
  }
}
