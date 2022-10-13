import { Component, OnDestroy, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserQuery } from '../../../../shared/user/user.query';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './revoke-token-dialog.component.html',
  styleUrls: ['./revoke-token-dialog.component.scss'],
})
export class RevokeTokenDialogComponent implements OnDestroy {
  username = '';
  usernameFormControl: FormControl;
  usernameForm: FormGroup;
  loading = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    public userQuery: UserQuery,
    public form: FormBuilder,
    public dialogRef: MatDialogRef<RevokeTokenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { revokeButtonClicked: boolean }
  ) {
    this.userQuery.username$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (username: string) => {
        this.username = username;
        this.usernameFormControl = new FormControl('', [Validators.required, this.validateUsername(this.username)]);
        this.usernameForm = new FormGroup({
          usernameFormControl: this.usernameFormControl,
        });
      },
      (error) => {
        console.error('Could not get username from userService');
      }
    );
  }

  // Close dialog
  onNoClick(): void {
    this.dialogRef.close();
  }

  /**
   * Revoke user's Dockstore token
   *
   * @memberof RevokeTokenDialogComponent
   */
  revokeToken(): void {
    this.loading = true;
    this.data.revokeButtonClicked = true;
    this.dialogRef.close(this.data.revokeButtonClicked);
  }

  /**
   * Custom validator to validate that the username entered into the form field is actually the user's username
   *
   * @private
   * @param {string} username  The user's actual username
   * @returns {ValidatorFn}  The custom validator function to be use for a form control
   * @memberof RevokeTokenDialogComponent
   */
  private validateUsername(username: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value !== username) {
        return { username: true };
      }
      return null;
    };
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
