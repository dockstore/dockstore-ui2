import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

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
