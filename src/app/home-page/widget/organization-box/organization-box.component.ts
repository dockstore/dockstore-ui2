import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequireAccountsModalComponent } from 'app/organizations/registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, OrganizationUser, OrganizationUpdateTime } from 'app/shared/openapi';
import { UsersService } from 'app/shared/swagger';
import { finalize, takeUntil } from 'rxjs/operators';
import { bootstrap4mediumModalSize } from 'app/shared/constants';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'app/shared/alert/state/alert.service';

@Component({
  selector: 'app-organization-box',
  templateUrl: './organization-box.component.html',
  styleUrls: ['./organization-box.component.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<OrganizationUpdateTime> = [];
  firstCall = true;
  totalOrgs: number = 0;
  pendingRequests: Array<OrganizationUser> = [];
  pendingInvites: Array<OrganizationUser> = [];
  EventType = Event.TypeEnum;

  public isLoading = true;

  constructor(
    private usersService: UsersService,
    private requestsQuery: RequestsQuery,
    private matDialog: MatDialog,
    private alertService: AlertService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getMyOrganizations();
    this.requestsQuery.myPendingOrganizationRequests$.subscribe(
      (requests) => {
        if (requests) {
          this.pendingRequests = requests;
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
    this.requestsQuery.myOrganizationInvites$.subscribe(
      (invites) => {
        if (invites) {
          this.pendingRequests = invites;
        }
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
      }
    );
  }

  getMyOrganizations() {
    this.usersService
      .getUserDockstoreOrganizations()
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myOrgs: Array<OrganizationUpdateTime>) => {
          this.listOfOrganizations = [];
          myOrgs.forEach((org: OrganizationUpdateTime) => {
            if (this.listOfOrganizations.length < 5) {
              this.listOfOrganizations.push(org);
            }
            if (this.firstCall) {
              this.totalOrgs += 1;
            }
          });
        },
        (error: HttpErrorResponse) => {
          this.alertService.detailedError(error);
        }
      );
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
