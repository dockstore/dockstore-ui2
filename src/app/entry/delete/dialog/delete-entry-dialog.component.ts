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
  constructor(
    public entriesService: EntriesService,
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: Entry
  ) {
    // this.dialogRef = dialogRef;
    // this.entry = entry;
  }

  // Close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    // TODO this space intentionally blank
  }

  /**
   * Delete the entry
   *
   * @memberof DeleteEntryDialogComponent
   */
  deleteEntry(): void {
    // TODO disable the buttons
    console.log('in deleteEntry()');
    this.entriesService
      .deleteEntry(this.entry.id)
      .pipe(
        finalize(() => {
          this.onNoClick();
        })
      )
      .subscribe(
        () => {
          console.log('successfully deleted entry');
          // TODO display something
          // TODO redirect to an appropriate location
        },
        (error: HttpErrorResponse) => {
          console.log('failed to delete entry');
          // TODO display something
        }
      );
  }
}
