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
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { AlertQuery } from './alert.query';
import { AlertStore } from './alert.store';

/**
 * How to use this service:
 * Before doing an HTTP call, use the start() method with some message indicating what is happening
 * On final success (regardless of other intermediate calls, use simpleSuccess() or detailedSuccess())
 * On final error or intermediate error, use simpleError() or detailedError()
 *
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

  /**
   * Handles successful HTTP response and shows success to the user by matSnackBar
   *
   * @memberof AlertService
   */
  public detailedSuccess() {
    const previousMessage = this.alertQuery.getSnapshot().message;
    this.setInfo('');
    this.matSnackBar.open(previousMessage + ' succeeded', 'Dismiss');
  }

  /**
   * Handles successful HTTP response but don't show success to the user
   *
   * @memberof AlertService
   */
  public simpleSuccess() {
    this.setInfo('');
  }

  /**
   * Handles error HTTP response and show both matSnackBar and an alert
   *
   * @param {HttpErrorResponse} error  The HttpErrorResponse received when the last HTTP request has errored
   * @memberof AlertService
   */
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

  /**
   * Handles error HTTP response and show matSnackBar
   *
   * @memberof AlertService
   */
  public simpleError() {
    const previousMessage = this.alertQuery.getSnapshot().message;
    this.clearEverything();
    this.matSnackBar.open(previousMessage + ' failed', 'Dismiss');
  }

  /**
   * Resets the state of the alerts (as if the user has not interacted with anything)
   *
   * @memberof AlertService
   */
  public clearEverything() {
    this.alertStore.setState(state => {
      return {
        ...state,
        message: '',
        type: 'info'
      };
    });
  }


  /**
   * Set error state
   *
   * @private
   * @param {string} message  The short error message
   * @param {string} details  The detailed error message
   * @memberof AlertService
   */
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

  /**
   * Set info state
   *
   * @private
   * @param {string} message  The short message indicating what is currently happening
   * @memberof AlertService
   */
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
