import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Observable } from 'rxjs';

import { UsersService } from '../../../shared/swagger';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {
  public canChangeUsername$: Observable<boolean>;
  constructor(
    public matDialog: MatDialog,
    public userQuery: UserQuery,
    public usersService: UsersService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getExtendedUserData();
    this.canChangeUsername$ = this.userQuery.canChangeUsername$;
  }

  deleteAccount() {
    if (this.matDialog.openDialogs.length === 0) {
      const dialogRef = this.matDialog.open(DeleteAccountDialogComponent, { width: '600px' });
    }
  }
}
