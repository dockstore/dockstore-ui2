import { Component, Inject } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export class InformationDialogData {
  message?: string;
  title?: string;
  closeButtonText?: string;
}

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
})
export class InformationDialogComponent {
  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: InformationDialogData) {}
}
