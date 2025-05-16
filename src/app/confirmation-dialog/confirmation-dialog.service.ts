import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmationDialogService {
  constructor(public dialog: MatDialog) {}
  /**
   * Creates a small confirmation dialog and returns an observable to be subscribed
   * TODO: The function should probably be extended to have more parameters (sizes, colors, button text, etc)
   *
   * @param {ConfirmationDialogData} data  Data required to construct the dialog
   * @param {string} size   Choose from bootstrap4smallModalSize, bootstrap4mediumModalSize, or bootstrap4LargeModalSize
   * @returns {Observable<boolean>}  true if 'Yes' was clicked, false if 'cancel' was clicked
   * @memberof ConfirmationDialogService
   */
  openDialog(data: ConfirmationDialogData, size: string): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: size,
      data: data,
    });
    return dialogRef.afterClosed();
  }
}
