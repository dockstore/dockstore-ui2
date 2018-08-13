import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { map } from 'rxjs/operators';

import { LogoutService } from '../../../../shared/logout.service';
import { User, UsersService } from '../../../../shared/swagger';
import { UserService } from '../../../user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss']
})
export class DeleteAccountDialogComponent {
  username = '';
  usernameFormControl: FormControl;
  usernameForm: FormGroup;

  constructor(public userService: UserService, public form: FormBuilder, public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private logoutService: LogoutService, private matSnackBar: MatSnackBar, private usersService: UsersService) {
    this.userService.user$.pipe(map((user: User) => {
      return user.username;
    })).subscribe((username: string) => {
      this.setupForm(username);
    });
  }

  /**
   * Sets up the form
   *
   * @param {string} username  The user's actual username
   * @memberof DeleteAccountDialogComponent
   */
  setupForm(username: string): void {
    this.username = username;
    this.usernameFormControl = new FormControl('', [Validators.required, this.validateUsername(this.username)]);
    this.usernameForm = new FormGroup({
      usernameFormControl: this.usernameFormControl
    });
  }

  // Close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Delete the user account
   *
   * @memberof DeleteAccountDialogComponent
   */
  deleteAccount(): void {
    this.usersService.selfDestruct().subscribe((status: boolean) => {
      if (status) {
        this.deleteAccountSuccess();
      } else {
        this.deleteAccountFailure();
      }
    }, (error: HttpErrorResponse) => {
      this.deleteAccountFailure();
    });
  }

  /**
   * What happens when deleting the account has succeeded.
   *
   * @private
   * @memberof DeleteAccountDialogComponent
   */
  private deleteAccountSuccess(): void {
    this.logoutService.logout();
    this.matSnackBar.open('Deleting Dockstore account succeeded', 'Dismiss', {
      duration: 5000,
    });
  }

  /**
   * What happens when deleteing the account has failed.
   *
   * @private
   * @memberof DeleteAccountDialogComponent
   */
  private deleteAccountFailure(): void {
    this.matSnackBar.open('Deleting Dockstore account failed', 'Dismiss', {
      duration: 5000,
    });
  }

  /**
   * Custom validator to validate that the username entered into the form field is actually the user's username
   *
   * @private
   * @param {string} username  The user's actual username
   * @returns {ValidatorFn}  The custom validator function to be use for a form control
   * @memberof DeleteAccountDialogComponent
   */
  private validateUsername(username: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== username) {
        return { 'username': true };
      }
      return null;
    };
  }
}
