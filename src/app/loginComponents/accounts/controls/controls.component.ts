import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { User } from '../../../shared/swagger';
import { UserService } from '../../user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  public isDisabled = false;
  constructor(public dialog: MatDialog, public userService: UserService) { }

  ngOnInit() {
    this.userService.user$.subscribe((user: User) => {
      if (user) {
        if (user.isAdmin) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
      }
    });
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { width: '600px' });
  }

}
