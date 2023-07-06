import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Entry } from '../../../shared/openapi';
import { EntriesService } from '../../../shared/openapi';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
})
export class DeleteEntryDialogComponent implements OnDestroy {
  // entriesService: EntriesService;
  // dialogRef: MatDialogRef<DeleteEntryDialogComponent>;
  // entry: Entry;
  clicked: boolean;
  constructor(
    public entriesService: EntriesService,
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: Entry
  ) {
    this.clicked = false;
    // this.dialogRef = dialogRef;
    // this.entry = entry;
  }

  click(): void {
    this.clicked = true;
  }

  // Close dialog
  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    // TODO this space intentionally blank
  }

  no(): void {
    this.click();
    this.close();
  }

  yes(): void {
    this.click();
    this.deleteEntry();
  }

  inform(message: string): void {
    // TODO make a snackbar
    console.log('MESSAGE: ' + message);
  }

  redirect(): void {
    // TODO add code that redirects
  }

  /**
   * Delete the entry
   *
   * @memberof DeleteEntryDialogComponent
   */
  deleteEntry(): void {
    console.log('in deleteEntry()');
    this.entriesService
      .deleteEntry(this.entry.id)
      .pipe(
        finalize(() => {
          this.close();
        })
      )
      .subscribe(
        () => {
          this.inform('successfully deleted entry');
          this.redirect();
        },
        (error: HttpErrorResponse) => {
          this.inform('failed to delete entry');
        }
      );
  }
}
