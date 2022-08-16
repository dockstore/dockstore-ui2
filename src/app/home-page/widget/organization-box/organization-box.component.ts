import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequireAccountsModalComponent } from 'app/organizations/registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, Organization, OrganizationUser, EventsService } from 'app/shared/openapi';
import { UsersService } from 'app/shared/swagger';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-organization-box',
  templateUrl: './organization-box.component.html',
  styleUrls: ['./organization-box.component.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<Organization> = [];
  events: Array<Event> = [];
  firstCall = true;
  pendingRequests: Array<OrganizationUser> = [];
  pendingInvites: Array<OrganizationUser> = [];
  EventType = Event.TypeEnum;

  public isLoading = true;

  constructor(
    private usersService: UsersService,
    private requestsQuery: RequestsQuery,
    private eventsService: EventsService,
    private matDialog: MatDialog
  ) {
    super();
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
    this.usersService.getStarredOrganizations().subscribe((starredOrganizations) => {
      this.listOfOrganizations = starredOrganizations;
    });
    this.eventsService
      .getEvents('STARRED_ORGANIZATION', 5)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((events) => {
        this.events = events;
      });
    this.isLoading = false;
  }

  /**
   * When the create organization button is clicked.
   * Opens the dialog to create organization
   *
   * @memberof OrganizationsComponent
   */
  requireAccounts(): void {
    this.matDialog.open(RequireAccountsModalComponent, { width: '600px' });
  }
}
