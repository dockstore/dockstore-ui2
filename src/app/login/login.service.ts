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
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../ng2-ui-auth/public_api';
import { AlertService } from '../shared/alert/state/alert.service';
import { TokenService } from '../shared/state/token.service';

@Injectable()
export class LoginService {
  constructor(
    private readonly auth: AuthService,
    private readonly alertService: AlertService,
    private readonly tokenService: TokenService
  ) {}

  private readonly ngUnsubscribe: Subject<{}> = new Subject();

  authenticate(provider: string): Observable<any> {
    return new Observable((observable) => {
      this.alertService.start('Logging in');
      //  looks like we can insert state and challenge here and thus hook in PKCE
      this.tokenService
        .getGitHubCodeChallenge()
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((challenge) => {
          const githubTokenChallenge = challenge.hashedValue;
          const githubState = challenge.state;

          return this.auth.authenticate(provider, githubState, githubTokenChallenge, { register: false }).subscribe(
            (user) => {
              this.alertService.simpleSuccess();
              observable.next(user);
              observable.complete();
            },
            (error: HttpErrorResponse | {}) => {
              // Error will be an HttpErrorResponse, typically from the webservice,
              // or an empty object, indicating that the user closed the login window.
              // For more info, see https://github.com/dockstore/dockstore-ui2/pull/1888
              if ('status' in error) {
                this.alertService.detailedError(error);
              } else {
                this.alertService.customDetailedError('Login failed', 'Could not login to Dockstore.');
              }
            }
          );
        });
    });
  }
}
