/*
 *    Copyright 2018 OICR
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
import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { formInputDebounceTime } from '../../../../shared/constants';
import { MyErrorStateMatcher } from '../../../../shared/error-state-matcher';
import { User } from '../../../../shared/swagger/model/user';
import { UserQuery } from '../../../../shared/user/user.query';
import { UserService } from '../../../../shared/user/user.service';
import { UsersService } from './../../../../shared/swagger/api/users.service';

@Component({
  selector: 'app-change-username',
  templateUrl: './change-username.component.html',
  styleUrls: ['./change-username.component.scss'],
})
export class ChangeUsernameComponent implements OnInit {
  @Input() noDialog: boolean;
  username: string;
  user: User;
  usernameTaken = false;
  usernameChangeRequired: boolean = false;
  checkingIfValid = false;
  canChangeUsername$: Observable<boolean>;
  showEmailWarning = false;
  matcher = new MyErrorStateMatcher();
  usernameFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('^[a-zA-Z][a-zA-Z0-9]*([-_]?[a-zA-Z0-9]+)*$'),
    Validators.maxLength(39),
  ]);
  protected ngUnsubscribe: Subject<{}> = new Subject();
  constructor(private userService: UserService, private usersService: UsersService, private userQuery: UserQuery) {}

  ngOnInit() {
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((user) => {
      if (user) {
        this.user = user;
        this.username = user.username;
        this.showEmailWarning = this.user.username.includes('@');
        this.usernameChangeRequired = this.user.usernameChangeRequired;
      }
    });
    this.canChangeUsername$ = this.userQuery.canChangeUsername$;
    this.enableDisableFormControl();
    this.usernameFormControl.valueChanges.pipe(debounceTime(formInputDebounceTime), takeUntil(this.ngUnsubscribe)).subscribe((value) => {
      if (this.usernameFormControl.valid) {
        this.checkIfUsernameExists(value);
      }
    });
  }

  /**
   * Sets usernameTaken and checkingIfValid
   */
  checkIfUsernameExists(value: string): void {
    this.username = value;
    this.checkingIfValid = true;
    this.usersService
      .checkUserExists(this.username)
      .pipe(
        finalize(() => {
          this.checkingIfValid = false;
        })
      )
      .subscribe(
        (userExists: boolean) => {
          this.usernameTaken = userExists;
        },
        (error) => {
          console.error(error);
        }
      );
  }

  /**
   * Attempts to update the username to the new value given by the user
   */
  updateUsername() {
    this.userService.updateUsername(this.username);
  }

  /**
   * Enable or disable form input if user can or cannot update username
   */
  enableDisableFormControl() {
    this.canChangeUsername$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((canChangeUsername: boolean) => {
      if (!canChangeUsername) {
        this.usernameFormControl.disable();
      } else {
        this.usernameFormControl.enable();
      }
    });
  }
}
