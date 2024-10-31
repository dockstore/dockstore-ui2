import { Component, Inject } from '@angular/core';
import {
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
  MatLegacyDialogModule,
} from '@angular/material/legacy-dialog';
import { OrganizationUpdateTime } from 'app/shared/openapi';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { NgFor, DatePipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';

@Component({
  selector: 'app-my-organizations-dialog',
  templateUrl: './my-organizations-dialog.component.html',
  standalone: true,
  imports: [FlexModule, MatLegacyDialogModule, NgFor, MatLegacyButtonModule, DatePipe],
})
export class MyOrganizationsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<MyOrganizationsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<OrganizationUpdateTime>
  ) {}

  // Close dialog and return org name to parent for navigation
  public dialogNavigate(orgName: string) {
    this.dialogRef.close({ data: orgName });
  }
}
