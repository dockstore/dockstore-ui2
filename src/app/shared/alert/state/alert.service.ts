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
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { AlertQuery } from './alert.query';
import { AlertStore } from './alert.store';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * How to use this service:
 * Before doing an HTTP call, use the start() method with some message indicating what is happening
 * On final success (regardless of other intermediate calls, use simpleSuccess() or detailedSuccess())
 * On final error or intermediate error, use simpleError() or detailedError()
 *
 * simpleSuccess() doesn't show the snackbar notification, detailedSuccess() does show it
 * simpleError() shows the snackbar but not the alert, detailedError() shows both
 * @export
 * @class AlertService
 */
@Injectable({ providedIn: 'root' })
export class AlertService {

  constructor(private alertStore: AlertStore, private matSnackBar: MatSnackBar, private alertQuery: AlertQuery) {
  }

  public start(message: string) {
    this.setInfo(message);
  }

  public detailedSuccess() {
    const previousMessage = this.alertQuery.getSnapshot().message;
    this.setInfo('');
    this.matSnackBar.open(previousMessage + ' succeeded', 'Dismiss');
  }

  public simpleSuccess() {
    this.setInfo('');
  }

  public detailedError(error: HttpErrorResponse) {
    let message: string;
    let details: string;
    if (error.status === 0) {
      // Error code of 0 means the webservice is not responding, likely down
      message = 'The webservice is currently down, possibly due to load. Please wait and try again later.';
    } else {
      message = 'The webservice encountered an error trying to create/modify.';
      details = '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
        (error.error && error.error.message ? error.error.message : error.error);
    }
    const previousMessage = this.alertQuery.getSnapshot().message;
    this.setError(message, details);
    this.matSnackBar.open(previousMessage + ' failed', 'Dismiss');
  }

  public simpleError() {
    const previousMessage = this.alertQuery.getSnapshot().message;
    this.clearEverything();
    this.matSnackBar.open(previousMessage + ' failed', 'Dismiss');
  }

  public clearEverything() {
    this.alertStore.setState(state => {
      return {
        ...state,
        message: '',
        type: 'info'
      };
    });
  }


  private setError(message: string, details: string) {
    this.alertStore.setState(state => {
      return {
        ...state,
        message: message,
        details: details,
        type: 'error'
      };
    });
  }

  private setInfo(message: string) {
    this.alertStore.setState(state => {
      return {
        ...state,
        message: message,
        details: '',
        type: 'info'
      };
    });
  }
}
