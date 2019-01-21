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
  public organizations$: Observable<Array<Organisation>>;

  constructor(private requestsQuery: RequestsQuery,
              private requestsService: RequestsService,
              private alertQuery: AlertQuery,
              public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loading$ = this.alertQuery.showInfo$;
    this.requestsService.updateOrganizations();
    this.organizations$ = this.requestsQuery.organizations$;
  }

  openDialog(name): void {
    const dialogRef = this.dialog.open(OrganizationRequestConfirmDialogComponent, {
      width: '300px',
      data: {name: name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
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
}
