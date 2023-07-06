import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { Entry } from '../../../shared/openapi';
import { EntriesService } from '../../../shared/openapi';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
})
export class DeleteEntryDialogComponent {
  clicked: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: Entry,
    public entriesService: EntriesService
  ) {
    this.clicked = false;
  }

  no(): void {
    this.click();
    this.close();
  }

  yes(): void {
    this.click();
    this.deleteEntry();
  }

  click(): void {
    this.clicked = true;
  }

  close(): void {
    this.dialogRef.close();
  }

  inform(message: string): void {
    // TODO make a snackbar
    console.log('MESSAGE: ' + message);
  }

  redirect(): void {
    // TODO add code that redirects
  }

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
          this.inform(`Successfully deleted the ${this.entry.entryTypeMetadata.term}`);
          this.redirect();
        },
        (error: HttpErrorResponse) => {
          this.inform(`Failed to delete the ${this.entry.entryTypeMetadata.term}`);
        }
      );
  }
}
