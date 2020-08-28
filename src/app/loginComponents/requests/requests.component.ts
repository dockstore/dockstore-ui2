import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { ConfirmationDialogData } from '../../confirmation-dialog/confirmation-dialog.component';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { Base } from '../../shared/base';
import { bootstrap4mediumModalSize } from '../../shared/constants';
import { Organization, OrganizationUser } from '../../shared/swagger';
import { UserQuery } from '../../shared/user/user.query';
import { RequestsQuery } from '../state/requests.query';
import { RequestsService } from '../state/requests.service';

@Component({
  selector: 'organization-request-confirm-dialog',
  templateUrl: 'organization-request-confirm-dialog.html'
})
export class OrganizationRequestConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<OrganizationRequestConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'organization-invite-confirm-dialog',
  templateUrl: 'organization-invite-confirm-dialog.html'
})
export class OrganizationInviteConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<OrganizationInviteConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  toolTip;

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  name: string;
  id: number;
  approve?: boolean; // true = approve, false = reject
}

@Component({
  selector: 'requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent extends Base implements OnInit {
  public allPendingOrganizations$: Observable<Array<Organization>>;
  public myOrganizationInvites$: Observable<Array<OrganizationUser>>;
  public myPendingOrganizationRequests$: Observable<Array<OrganizationUser>>;
  public myRejectedOrganizationRequests$: Observable<Array<OrganizationUser>>;
  isLoading$: Observable<boolean>;
  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  userId$: Observable<number>;

  constructor(
    private requestsQuery: RequestsQuery,
    private requestsService: RequestsService,
    public dialog: MatDialog,
    private userQuery: UserQuery,
    private confirmationDialogService: ConfirmationDialogService
  ) {
    super();
  }

  ngOnInit() {
    this.isLoading$ = this.requestsQuery.isLoading$;
    this.requestsService.updateMyMemberships();

    this.allPendingOrganizations$ = this.requestsQuery.allPendingOrganizations$;
    this.myOrganizationInvites$ = this.requestsQuery.myOrganizationInvites$;
    this.myPendingOrganizationRequests$ = this.requestsQuery.myPendingOrganizationRequests$;
    this.myRejectedOrganizationRequests$ = this.requestsQuery.myRejectedOrganizationRequests$;

    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
    this.userId$ = this.userQuery.userId$;

    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isAdminOrCurator => {
      if (isAdminOrCurator) {
        this.requestsService.updateCuratorOrganizations(); // requires admin or curator permissions
      }
    });
  }

  openDialog(name: string, id: number, approve: boolean): void {
    const dialogRef = this.dialog.open(OrganizationRequestConfirmDialogComponent, {
      width: '400px',
      data: { name: name, id: id, approve: approve }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.approve) {
          this.requestsService.approveOrganization(result.id);
        } else {
          this.requestsService.rejectOrganization(result.id);
        }
      }
    });
  }

  openInviteDialog(name: string, id: number, approve: boolean): void {
    const dialogRef = this.dialog.open(OrganizationInviteConfirmDialogComponent, {
      width: '400px',
      data: { name: name, id: id, approve: approve }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.requestsService.acceptOrRejectOrganizationInvite(result.id, result.approve);
      }
    });
  }

  rerequestReview(membership: OrganizationUser) {
    this.requestsService.requestRereview(membership.organization.id);
  }

  removeOrganizationDialog(organizationName: string, organizationStatus: string, organizationID: number) {
    const confirmationDialogData: ConfirmationDialogData = {
      title: `Are you sure you wish to delete this ${organizationStatus} organization: ${organizationName}?`,
      message: `All information associated with <b>${organizationName}</b> will be deleted.`,
      cancelButtonText: 'Cancel',
      confirmationButtonText: 'Delete'
    };
    this.confirmationDialogService
      .openDialog(confirmationDialogData, bootstrap4mediumModalSize)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.deleteOrganization(organizationID);
        }
      });
  }

  deleteOrganization(organizationID: number) {
    this.userQuery.isAdminOrCurator$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isAdminOrCurator => {
      if (isAdminOrCurator) {
        this.requestsService.deleteOrganization(organizationID, true);
      } else {
        this.requestsService.deleteOrganization(organizationID, false);
      }
    });
  }
}
