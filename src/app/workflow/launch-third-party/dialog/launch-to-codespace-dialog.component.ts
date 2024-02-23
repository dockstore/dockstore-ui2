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
import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Router } from '@angular/router';
import { Dockstore } from '../../../shared/dockstore.model';
import { DockstoreTool, Entry, Workflow } from '../../../shared/openapi';

@Component({
  selector: 'app-launch-to-codespace-dialog',
  templateUrl: './launch-to-codespace-dialog.component.html',
  styleUrls: ['./launch-to-codespace-dialog.component.scss'],
})
export class LaunchToCodespaceDialogComponent {
  clicked: boolean;
  term: string;
  path: string;
  hasDevcontainer: boolean;
  Dockstore = Dockstore;

  constructor(
    public dialogRef: MatDialogRef<LaunchToCodespaceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { entry: Entry; hasDevcontainer: boolean },
    public matSnackBar: MatSnackBar,
    public router: Router
  ) {
    this.clicked = false;
    this.term = data.entry.entryTypeMetadata.term;
    this.path = (data.entry as Workflow).full_workflow_path ?? (data.entry as DockstoreTool).tool_path ?? data.entry.gitUrl;
    this.hasDevcontainer = data.hasDevcontainer;
  }

  no(): void {
    this.click();
    this.close(false);
  }

  yes(): void {
    this.click();
    this.close(true);
  }

  click(): void {
    this.clicked = true;
  }

  reset(): void {
    this.clicked = false;
  }

  close(action: boolean): void {
    this.dialogRef.close(action);
  }
}
