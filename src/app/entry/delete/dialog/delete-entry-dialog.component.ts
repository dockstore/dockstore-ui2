// TODO add copyright header
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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
    public matSnackBar: MatSnackBar,
    public router: Router,
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
    this.matSnackBar.open(message, 'Dismiss');
  }

  redirect(): void {
    this.router.navigate(['/dashboard']);
  }

  deleteEntry(): void {
    this.entriesService
      .deleteEntry(this.entry.id)
      .pipe(
        finalize(() => {
          this.close();
        })
      )
      .subscribe(
        () => {
          this.inform(`The ${this.entry.entryTypeMetadata.term} was deleted.`);
          this.redirect();
        },
        (error: HttpErrorResponse) => {
          this.inform(`Could not delete this ${this.entry.entryTypeMetadata.term}.`);
        }
      );
  }
}
