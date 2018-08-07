import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss']
})
export class DeleteAccountDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteAccount(): void {
    console.log('potato');
  }

}
