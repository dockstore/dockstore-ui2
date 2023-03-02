import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequireAccountsModalComponent } from 'app/organizations/registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, OrganizationUser, OrganizationUpdateTime } from 'app/shared/openapi';
import { UsersService } from '../../../shared/openapi';
import { finalize, takeUntil } from 'rxjs/operators';
import { bootstrap4mediumModalSize } from 'app/shared/constants';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-organization-box',
  templateUrl: './organization-box.component.html',
  styleUrls: ['./organization-box.component.scss', '../../../shared/styles/dashboard-boxes.scss'],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  listOfOrganizations: Array<OrganizationUpdateTime> = [];
  pendingRequests$: Observable<Array<OrganizationUser>>;
  pendingInvites$: Observable<Array<OrganizationUser>>;
  filterText: string;
  totalOrgs: number = 0;
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
    this.pendingRequests$ = this.requestsQuery.myPendingOrganizationRequests$;
    this.pendingInvites$ = this.requestsQuery.myOrganizationInvites$;
  }

  private getMyOrganizations() {
    this.usersService
      .getUserDockstoreOrganizations(null, this.filterText, 'response')
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (myOrgs: HttpResponse<OrganizationUpdateTime[]>) => {
          this.listOfOrganizations = myOrgs.body.slice(0, 7);
          const url = new URL(myOrgs.url);
          if (!url.searchParams.get('filter')) {
            this.totalOrgs = myOrgs.body.length;
          }
        },
        (error: HttpErrorResponse) => {
          this.listOfOrganizations = [];
          this.alertService.detailedError(error);
        }
      );
  }

  onTextChange(event: any) {
    this.isLoading = true;
    this.getMyOrganizations();
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
