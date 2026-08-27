import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

export class InformationDialogData {
  message?: string;
  title?: string;
  closeButtonText?: string;
}

@Component({
  selector: 'app-information-dialog',
  templateUrl: './information-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatDialogModule, FlexModule, MatButtonModule],
})
export class InformationDialogComponent {
  constructor(public dialogRef: MatDialogRef<InformationDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: InformationDialogData) {}
}
