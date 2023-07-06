import { Component, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
})
export class DeleteEntryDialogComponent implements OnDestroy {
  dialogRef: MatDialogRef<DeleteEntryDialogComponent>;
  constructor(
    // TODO add deleteEntryService
    dialogRef: MatDialogRef<DeleteEntryDialogComponent>
  ) {
    this.dialogRef = dialogRef;
  }

  // Close dialog
  onNoClick(): void {
    // this.dialogRef.close();
  }

  ngOnDestroy(): void {
    // TODO this space intentionally blank
  }

  /**
   * Delete the user account
   *
   * @memberof DeleteAccountDialogComponent
   */
  deleteEntry(): void {
    // TODO fill in
    console.log('in deleteEntry()');
    this.onNoClick();
  }
}
