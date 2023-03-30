import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrganizationUpdateTime } from 'app/shared/openapi';

@Component({
  selector: 'app-my-organizations-dialog',
  templateUrl: './my-organizations-dialog.component.html',
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
