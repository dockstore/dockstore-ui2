import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { NgIf } from '@angular/common';

export class InformationDialogData {
  message?: string;
  title?: string;
  closeButtonText?: string;
}

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  standalone: true,
  imports: [NgIf, MatLegacyDialogModule, FlexModule, MatLegacyButtonModule],
})
export class InformationDialogComponent {
  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: InformationDialogData) {}
}
