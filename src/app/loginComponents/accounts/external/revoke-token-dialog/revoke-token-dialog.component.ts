/*
 *    Copyright 2022 OICR, UCSC
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { Component, OnDestroy, Inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserQuery } from '../../../../shared/user/user.query';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Base } from '../../../../shared/base';

@Component({
  selector: 'app-revoke-token-dialog',
  templateUrl: './revoke-token-dialog.component.html',
  styleUrls: ['./revoke-token-dialog.component.scss'],
})
export class RevokeTokenDialogComponent extends Base implements OnDestroy {
  username = '';
  usernameFormControl: FormControl;
  usernameForm: FormGroup;
  constructor(public userQuery: UserQuery, public form: FormBuilder, public dialogRef: MatDialogRef<RevokeTokenDialogComponent>) {
    super();
    this.userQuery.username$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((username: string) => {
      this.username = username;
      this.usernameFormControl = new FormControl('', [Validators.required, this.validateUsername(this.username)]);
      this.usernameForm = new FormGroup({
        usernameFormControl: this.usernameFormControl,
      });
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
    this.dialogRef.close(true);
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
}
