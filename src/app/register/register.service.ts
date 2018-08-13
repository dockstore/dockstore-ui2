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

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'ng2-ui-auth';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class RegisterService {

  constructor(private auth: AuthService, private matSnackBar: MatSnackBar) { }

  authenticate(provider: string): Observable<any> {
    return Observable.create(observable => {
      return this.auth.authenticate(provider, { 'register' : true}).subscribe(user => {
        observable.next(user);
        observable.complete();
      }, error => {
        this.matSnackBar.open(error._body, 'Dismiss');
      });
    });
  }
}
