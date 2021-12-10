import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { InformationDialogComponent, InformationDialogData } from './information-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class InformationDialogService {
  constructor(public dialog: MatDialog) {}
  /**
   * Creates a small informational modal dialog with a single button that closes it.
   * @param {InformationDialogData} data  Data required to construct the dialog
   * @param {string} size   Choose from bootstrap4smallModalSize, bootstrap4mediumModalSize, or bootstrap4LargeModalSize
   * @returns {Observable<void>} Produces a new value when closed
   * @memberof InformationDialogService
   */
  openDialog(data: InformationDialogData, size: string): Observable<any> {
    const dialogRef = this.dialog.open(InformationDialogComponent, {
      width: size,
      data: data,
    });
    return dialogRef.afterClosed();
  }
}
