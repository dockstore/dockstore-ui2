import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequireAccountsModalComponent } from 'app/organizations/registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, UsersService, OrganizationUser } from 'app/shared/openapi';
import { bootstrap4mediumModalSize } from 'app/shared/constants';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-organization-box',
  templateUrl: './organization-box.component.html',
  styleUrls: ['./organization-box.component.scss', '../../../shared/styles/dashboard-boxes.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  public pendingRequests$: Observable<Array<OrganizationUser>>;
  public pendingInvites$: Observable<Array<OrganizationUser>>;
  public totalOrgs: number = 0;
  public EventType = Event.TypeEnum;
  public isLoading = true;

  constructor(private usersService: UsersService, private requestsQuery: RequestsQuery, private matDialog: MatDialog) {
    super();
  }

  ngOnInit(): void {
    this.usersService
      .getUserDockstoreOrganizations()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((myOrgs) => {
        this.totalOrgs = myOrgs.length;
      });
    this.pendingRequests$ = this.requestsQuery.myPendingOrganizationRequests$;
    this.pendingInvites$ = this.requestsQuery.myOrganizationInvites$;
  }

  /**
   * When the create organization button is clicked.
   * Opens the dialog to create organization
   *
   * @memberof OrganizationsComponent
   */
  requireAccounts(): void {
    this.matDialog.open(RequireAccountsModalComponent, { width: bootstrap4mediumModalSize });
  }
}
