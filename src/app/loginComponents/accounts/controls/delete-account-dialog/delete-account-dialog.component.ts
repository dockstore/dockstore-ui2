import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy } from '@angular/core';
import {
  AbstractControl,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  ValidatorFn,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatLegacyDialogRef as MatDialogRef, MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacySnackBar as MatSnackBar } from '@angular/material/legacy-snack-bar';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { LogoutService } from '../../../../shared/logout.service';
import { UsersService } from '../../../../shared/openapi';
import { UserQuery } from '../../../../shared/user/user.query';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule } from '@angular/material/legacy-input';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { NgIf } from '@angular/common';
import { MatDividerModule } from '@angular/material/divider';
import { AlertComponent } from '../../../../shared/alert/alert.component';

@Component({
  selector: 'app-delete-account-dialog',
  templateUrl: './delete-account-dialog.component.html',
  styleUrls: ['./delete-account-dialog.component.scss'],
  standalone: true,
  imports: [
    MatLegacyDialogModule,
    AlertComponent,
    MatDividerModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
    MatLegacyFormFieldModule,
    MatLegacyInputModule,
    MatLegacyButtonModule,
  ],
})
export class DeleteAccountDialogComponent implements OnDestroy {
  username = '';
  usernameFormControl: UntypedFormControl;
  usernameForm: UntypedFormGroup;
  loading = false;
  private ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    public userQuery: UserQuery,
    public form: UntypedFormBuilder,
    public dialogRef: MatDialogRef<DeleteAccountDialogComponent>,
    private logoutService: LogoutService,
    private matSnackBar: MatSnackBar,
    private usersService: UsersService
  ) {
    this.userQuery.username$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(
      (username: string) => {
        this.setupForm(username);
      },
      (error) => {
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
    this.usernameFormControl = new UntypedFormControl('', [Validators.required, this.validateUsername(this.username)]);
    this.usernameForm = new UntypedFormGroup({
      usernameFormControl: this.usernameFormControl,
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
   * What happens when deleting the account has failed.
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
