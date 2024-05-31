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
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { Entry, EntryType, EntriesService, DockstoreTool, Workflow } from '../../../shared/openapi';
import { AlertService } from '../../../shared/alert/state/alert.service';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf, TitleCasePipe } from '@angular/common';
import { AlertComponent } from '../../../shared/alert/alert.component';

@Component({
  selector: 'app-delete-entry-dialog',
  templateUrl: './delete-entry-dialog.component.html',
  styleUrls: ['./delete-entry-dialog.component.scss'],
  standalone: true,
  imports: [MatLegacyDialogModule, AlertComponent, NgIf, FlexModule, MatLegacyButtonModule, TitleCasePipe],
})
export class DeleteEntryDialogComponent {
  clicked: boolean;
  term: string;
  path: string;
  fromDockstoreYml: boolean;
  isNotebook: boolean;
  isService: boolean;

  constructor(
    public dialogRef: MatDialogRef<DeleteEntryDialogComponent>,
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
    this.isNotebook = entry.entryType === EntryType.NOTEBOOK;
    this.isService = entry.entryType === EntryType.SERVICE;
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

  reset(): void {
    this.clicked = false;
  }

  close(): void {
    this.dialogRef.close();
  }

  redirect(): void {
    this.router.navigate(['/dashboard']);
  }

  deleteEntry(): void {
    this.alertService.start(`Deleting ${this.path}`);
    this.entriesService.deleteEntry(this.entry.id).subscribe(
      () => {
        this.alertService.detailedSuccess(`Successfully deleted ${this.path}`);
        this.close();
        this.redirect();
      },
      (error: HttpErrorResponse) => {
        this.alertService.detailedError(error);
        this.reset();
      }
    );
  }
}
