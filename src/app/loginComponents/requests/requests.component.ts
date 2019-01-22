import { Component, OnInit, Inject } from '@angular/core';
import { RequestsService } from '../state/requests.service';
import { RequestsQuery } from '../state/requests.query';
import { Observable } from 'rxjs';
import { Organisation } from '../../shared/swagger';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss']
})
export class RequestsComponent implements OnInit {
  loading$: Observable<boolean>;
  public pendingOrganizations$: Observable<Array<Organisation>>;
  currentOrgId: number;

  constructor(private requestsQuery: RequestsQuery,
              private requestsService: RequestsService,
              private alertQuery: AlertQuery,
              public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading$ = this.alertQuery.showInfo$;
    this.requestsService.updateOrganizations();
    this.pendingOrganizations$ = this.requestsQuery.pendingOrganizations$;
  }

  openDialog(name: string, id: number, approve: boolean): void {
    const dialogRef = this.dialog.open(OrganizationRequestConfirmDialogComponent, {
      width: '350px',
      data: { name: name, id: id, approve: approve }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        if (result.approve) {
          console.log('approve');
          // this.requestsService.approveOrganization(result.id);
        } else {
          console.log('reject');
          // this.requestsService.rejectOrganization(result.id);
        }
      }
    });
  }
}

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

export interface DialogData {
  name: string;
  id: number;
  approve: boolean; // true = approve, false = reject
}
