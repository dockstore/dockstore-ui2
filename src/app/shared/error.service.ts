/*
 *    Copyright 2017 OICR
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
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ErrorService {
    errorObj$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor() { }
    setErrorAlert(error: HttpErrorResponse) {
        let errorObj = null;
        if (error) {
          if (error.status === 0) {
            // Error code of 0 means the webservice is not responding, likely down
            errorObj = {
              message: 'The webservice is currently down, possibly due to load. Please wait and try again later.'
            };
          } else {
            errorObj = {
              message: 'The webservice encountered an error trying to create/modify.',
              errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
              error.error
            };
          }
        }
        this.errorObj$.next(errorObj);
    }
}
