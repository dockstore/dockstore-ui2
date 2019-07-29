import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { bootstrap4smallModalSize } from 'app/shared/constants';
import { Observable } from 'rxjs';
import { ConfirmationDialogComponent, ConfirmationDialogData } from './confirmation-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  constructor(public dialog: MatDialog) {}
  /**
   * Creates a small confirmation dialog and returns an observable to be subscribed
   * TODO: The function should probably be extended to have more parameters (sizes, colors, button text, etc)
   *
   * @param {ConfirmationDialogData} data  Data required to construct the dialog
   * @returns {Observable<boolean>}  true if 'Yes' was clicked, false if 'cancel' was clicked
   * @memberof ConfirmationDialogService
   */
  openDialog(data: ConfirmationDialogData): Observable<boolean> {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: bootstrap4smallModalSize,
      data: data
    });
    return dialogRef.afterClosed();
  }
}
