import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';
import { UsersService } from '../../../shared/openapi';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent implements OnInit {
  public canChangeUsername$: Observable<boolean>;
  constructor(public dialog: MatDialog, public userQuery: UserQuery, public usersService: UsersService, public userService: UserService) {}

  ngOnInit() {
    this.userService.getExtendedUserData();
    this.canChangeUsername$ = this.userQuery.canChangeUsername$;
  }

  deleteAccount() {
    this.dialog.open(DeleteAccountDialogComponent, { width: '600px' });
  }
}
