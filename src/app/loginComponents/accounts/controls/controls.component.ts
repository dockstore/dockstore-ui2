import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Observable } from 'rxjs';
import { UsersService } from '../../../shared/openapi';
import { UserQuery } from '../../../shared/user/user.query';
import { UserService } from '../../../shared/user/user.service';
import { DeleteAccountDialogComponent } from './delete-account-dialog/delete-account-dialog.component';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyCardModule } from '@angular/material/legacy-card';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
  standalone: true,
  imports: [NgIf, MatLegacyCardModule, MatIconModule, MatLegacyButtonModule, AsyncPipe],
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
