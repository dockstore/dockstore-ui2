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
import { Entry, EntriesService, DockstoreTool, Workflow } from '../../../shared/openapi';
import { AlertService } from '../../../shared/alert/state/alert.service';

@Component({
  selector: 'app-archive-entry-dialog',
  templateUrl: './archive-entry-dialog.component.html',
  styleUrls: ['./archive-entry-dialog.component.scss'],
})
export class ArchiveEntryDialogComponent {
  clicked: boolean;
  term: string;
  path: string;
  fromDockstoreYml: boolean;

  constructor(
    public dialogRef: MatDialogRef<ArchiveEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public entry: Entry,
    public matSnackBar: MatSnackBar,
    public router: Router,
    public alertService: AlertService,
    public entriesService: EntriesService
  ) {
    this.clicked = false;
    this.term = entry.entryTypeMetadata.term;
    this.path = (entry as Workflow).full_workflow_path ?? (entry as DockstoreTool).tool_path ?? entry.gitUrl;
    this.fromDockstoreYml = (entry as Workflow | DockstoreTool).mode === Workflow.ModeEnum.DOCKSTOREYML; // The workflow and tool enums are confirmed to be equal in a test.
  }

  no(): void {
    this.click();
    this.close();
  }

  yes(): void {
    this.click();
    this.archiveEntry();
  }

  click(): void {
    this.clicked = true;
  }

  reset(): void {
    this.clicked = false;
  }

  close(archived: Entry = undefined): void {
    this.dialogRef.close(archived);
  }

  archiveEntry(): void {
    this.alertService.start(`Archiving ${this.path}`);
    this.entriesService.archiveEntry(this.entry.id).subscribe(
      (archived: Entry) => {
        this.alertService.detailedSuccess(`Successfully archived ${this.path}`);
        this.close(archived);
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.reset();
      }
    );
  }
}
