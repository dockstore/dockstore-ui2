import { Component, OnInit, Inject } from '@angular/core';
import { RequestsService } from '../state/requests.service';
import { RequestsQuery } from '../state/requests.query';
import { Observable } from 'rxjs';
import { Organization, OrganizationUser } from '../../shared/swagger';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { UserQuery } from '../../shared/user/user.query';

@Component({
  selector: 'organization-request-confirm-dialog',
  templateUrl: 'organization-request-confirm-dialog.html',
})
export class OrganizationRequestConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OrganizationRequestConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

@Component({
  selector: 'organization-invite-confirm-dialog',
  templateUrl: 'organization-invite-confirm-dialog.html',
})
export class OrganizationInviteConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<OrganizationInviteConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}

export interface DialogData {
  name: string;
  id: number;
  approve: boolean; // true = approve, false = reject
}


@Component({
  selector: 'requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  public allPendingOrganizations$: Observable<Array<Organization>>;
  public myOrganizationInvites$: Observable<Array<OrganizationUser>>;
  public myPendingOrganizationRequests$: Observable<Array<OrganizationUser>>;
  isLoading$: Observable<boolean>;
  currentOrgId: number;
  isAdmin$: Observable<boolean>;
  isCurator$: Observable<boolean>;
  userId$: Observable<number>;

  constructor(private requestsQuery: RequestsQuery,
              private requestsService: RequestsService,
              public dialog: MatDialog,
              private userQuery: UserQuery
  ) { }

  ngOnInit() {
    this.isLoading$ = this.requestsQuery.isLoading$;
    this.requestsService.updateCuratorOrganizations();
    this.requestsService.updateMyMemberships();

    this.allPendingOrganizations$ = this.requestsQuery.allPendingOrganizations$;
    this.myOrganizationInvites$ = this.requestsQuery.myOrganizationInvites$;
    this.myPendingOrganizationRequests$ = this.requestsQuery.myPendingOrganizationRequests$;

    this.isAdmin$ = this.userQuery.isAdmin$;
    this.isCurator$ = this.userQuery.isCurator$;
    this.userId$ = this.userQuery.userId$;
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
}
