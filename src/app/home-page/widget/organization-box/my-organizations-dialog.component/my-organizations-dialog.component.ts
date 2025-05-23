import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { OrganizationUpdateTime } from 'app/shared/openapi';
import { MatButtonModule } from '@angular/material/button';
import { NgFor, DatePipe } from '@angular/common';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-my-organizations-dialog',
  templateUrl: './my-organizations-dialog.component.html',
  styleUrls: ['../../../../shared/styles/dashboard-boxes.scss'],
  standalone: true,
  imports: [FlexModule, MatDialogModule, NgFor, MatButtonModule, DatePipe, MatChipsModule],
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
