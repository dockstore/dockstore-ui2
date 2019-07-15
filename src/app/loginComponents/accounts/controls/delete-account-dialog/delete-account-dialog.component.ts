import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { LogoutService } from '../../../../shared/logout.service';
import { UsersService } from '../../../../shared/swagger';
import { UserQuery } from '../../../../shared/user/user.query';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss']
})
export class DeleteAccountDialogComponent implements OnDestroy {
  username = '';
  usernameFormControl: FormControl;
  usernameForm: FormGroup;
  loading = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    public userQuery: UserQuery,
    public form: FormBuilder,
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private logoutService: LogoutService,
    private matSnackBar: MatSnackBar,
    private usersService: UsersService
  ) {
    this.userQuery.username$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (username: string) => {
        this.setupForm(username);
      },
      error => {
        console.error('Could not get username from userService');
      }
    );
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
    this.loading = true;
    this.usersService
      .selfDestruct()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.onNoClick();
        })
      )
      .subscribe(
        (status: boolean) => {
          if (status) {
            this.deleteAccountSuccess();
          } else {
            this.deleteAccountFailure();
          }
        },
        (error: HttpErrorResponse) => {
          this.deleteAccountFailure();
        }
      );
  }

  /**
   * What happens when deleting the account has succeeded.
   *
   * @private
   * @memberof DeleteAccountDialogComponent
   */
  private deleteAccountSuccess(): void {
    this.logoutService.logout();
    this.matSnackBar.open('Deleting Dockstore account succeeded', 'Dismiss');
  }

  /**
   * What happens when deleteing the account has failed.
   *
   * @private
   * @memberof DeleteAccountDialogComponent
   */
  private deleteAccountFailure(): void {
    this.matSnackBar.open('Deleting Dockstore account failed', 'Dismiss');
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
