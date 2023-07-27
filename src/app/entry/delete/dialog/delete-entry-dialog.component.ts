/*
 *     Copyright 2023 OICR, UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Entry, DockstoreTool, Workflow } from '../../../shared/openapi';
import { EntriesService } from '../../../shared/openapi';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
})
export class DeleteEntryDialogComponent {
  clicked: boolean;
  term: string;
  path: string;
  fromDockstoreYml: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: Entry,
    public matSnackBar: MatSnackBar,
    public router: Router,
    public entriesService: EntriesService
  ) {
    this.clicked = false;
    this.term = entry.entryTypeMetadata.term;
    this.path = (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path;
    this.fromDockstoreYml = (entry as Workflow | DockstoreTool).mode === Workflow.ModeEnum.DOCKSTOREYML; // The workflow and tool enums are confirmed to be equal in a test.
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
          this.inform(`The ${this.term} was deleted.`);
          this.redirect();
        },
        (error: HttpErrorResponse) => {
          this.inform(`Could not delete this ${this.term}.`);
        }
      );
  }
}
