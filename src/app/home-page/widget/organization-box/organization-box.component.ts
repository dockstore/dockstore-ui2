import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RequestsQuery } from 'app/loginComponents/state/requests.query';
import { RequireAccountsModalComponent } from 'app/organizations/registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { Base } from 'app/shared/base';
import { Dockstore } from 'app/shared/dockstore.model';
import { Event, UsersService, OrganizationUser, OrganizationUpdateTime } from 'app/shared/openapi';
import { bootstrap4mediumModalSize, bootstrap4largeModalSize } from 'app/shared/constants';
import { Observable } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { MyOrganizationsDialogComponent } from './my-organizations-dialog.component/my-organizations-dialog.component';
import { Router, RouterLink } from '@angular/router';
import { RecentEventsComponent } from '../../recent-events/recent-events.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-organization-box',
  templateUrl: './organization-box.component.html',
  styleUrls: ['./organization-box.component.scss', '../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    FlexModule,
    MatIconModule,
    RouterLink,
    MatTooltipModule,
    NgIf,
    MatButtonModule,
    MatDividerModule,
    RecentEventsComponent,
    AsyncPipe,
  ],
})
export class OrganizationBoxComponent extends Base implements OnInit {
  Dockstore = Dockstore;
  public pendingRequests$: Observable<Array<OrganizationUser>>;
  public pendingInvites$: Observable<Array<OrganizationUser>>;
  public totalOrgs: number = 0;
  public listOfOrgs: Array<OrganizationUpdateTime>;
  public EventType = Event.TypeEnum;
  public isLoading = true;

  constructor(
    private usersService: UsersService,
    private requestsQuery: RequestsQuery,
    private matDialog: MatDialog,
    private router: Router
  ) {
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
        this.listOfOrgs = myOrgs;
      });
    this.pendingRequests$ = this.requestsQuery.myPendingOrganizationRequests$;
    this.pendingInvites$ = this.requestsQuery.myOrganizationInvites$;
  }

  /**
   * Open dialog diaplaying user's organizations
   * When user selects an organization, close dialog and navigate
   *
   * NOTE: Remove my organizations dialog once my organizations page is implemented
   */
  viewMyOrganizations(): void {
    const dialogRef = this.matDialog.open(MyOrganizationsDialogComponent, { width: bootstrap4largeModalSize, data: this.listOfOrgs });

    // Navigate to selected Organization
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.data) {
        this.router.navigateByUrl('/organizations/' + result.data);
      }
    });
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
