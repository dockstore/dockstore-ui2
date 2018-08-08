import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { map } from 'rxjs/operators';

import { User } from '../../../../shared/swagger';
import { UserService } from '../../../user.service';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss']
})
export class DeleteAccountDialogComponent {
  username = '';
  usernameFormControl: FormControl;
  usernameForm: FormGroup;

  constructor(public userService: UserService, public form: FormBuilder, public dialogRef: MatDialogRef<DeleteAccountDialogComponent>) {
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
    console.log('Deleting your account!!!');
  }

  /**
   * Custom validator to validate that the username entered into the form field is actually the user's username
   *
   * @param {string} username  The user's actual username
   * @returns {ValidatorFn}  The custom validator function to be use for a form control
   * @memberof DeleteAccountDialogComponent
   */
  validateUsername(username: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== username) {
        return { 'username': true };
      }
      return null;
    };
  }
}
