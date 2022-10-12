import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { LogoutService } from '../../../../shared/logout.service';
import { TokensService } from '../../../../shared/openapi';
import { UserQuery } from '../../../../shared/user/user.query';
import { AuthService } from 'ng2-ui-auth';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './revoke-token-dialog.component.html',
  styleUrls: ['./revoke-token-dialog.component.scss'],
})
export class RevokeTokenDialogComponent implements OnDestroy {
  username = '';
  usernameFormControl: FormControl;
  public dockstoreToken: string;
  usernameForm: FormGroup;
  loading = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    public userQuery: UserQuery,
    public form: FormBuilder,
    public dialogRef: MatDialogRef<RevokeTokenDialogComponent>,
    private logoutService: LogoutService,
    private matSnackBar: MatSnackBar,
    private tokensService: TokensService,
    private authService: AuthService
  ) {
    this.userQuery.username$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (username: string) => {
        this.setupForm(username);
      },
      (error) => {
        console.error('Could not get username from userService');
      }
    );
    this.dockstoreToken = this.authService.getToken();
  }

  /**
   * Sets up the form
   *
   * @param {string} username  The user's actual username
   * @memberof RevokeTokenDialogComponent
   */
  setupForm(username: string): void {
    this.username = username;
    this.usernameFormControl = new FormControl('', [Validators.required, this.validateUsername(this.username)]);
    this.usernameForm = new FormGroup({
      usernameFormControl: this.usernameFormControl,
    });
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
    this.tokensService
      .deleteToken(this.dockstoreToken)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.onNoClick();
        })
      )
      .subscribe(
        (status: boolean) => {
          console.log(this.dockstoreToken);
          if (status) {
            this.revokeTokenSuccess();
          } else {
            this.revokeTokenFailure();
          }
        },
        (error: HttpErrorResponse) => {
          this.revokeTokenFailure();
        }
      );
  }

  /**
   * What happens when deleting the account has succeeded.
   *
   * @private
   * @memberof RevokeTokenDialogComponent
   */
  private revokeTokenSuccess(): void {
    this.logoutService.logout();
    this.matSnackBar.open('Revoking Dockstore token succeeded', 'Dismiss');
  }

  /**
   * What happens when deleteing the account has failed.
   *
   * @private
   * @memberof RevokeTokenDialogComponent
   */
  private revokeTokenFailure(): void {
    this.matSnackBar.open('Revoking Dockstore token failed', 'Dismiss');
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
