import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';

import { UsersService } from '../../../shared/swagger';
import { ExtendedUserData } from '../../../shared/swagger/model/extendedUserData';
import { UserService } from '../../user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  public isDisabled = true;
  constructor(public dialog: MatDialog, public userService: UserService, public usersService: UsersService) { }

  ngOnInit() {
    this.usersService.getExtendedUserData().subscribe((extendedUserData: ExtendedUserData) => {
      if (extendedUserData) {
        this.isDisabled = !extendedUserData.canChangeUsername;
      } else {
        this.isDisabled = true;
      }
    }, error => {
      this.isDisabled = true;
      console.error('Could not retrieve ExtendedUserData');
    });
  }

  deleteAccount() {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { width: '600px' });
  }

}
