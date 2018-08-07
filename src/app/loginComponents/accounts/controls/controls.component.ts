import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { width: '600px' });
  }

}
