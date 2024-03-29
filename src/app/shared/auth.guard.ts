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
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map } from 'rxjs/operators';
import { LogoutService } from './logout.service';
import { UsersService } from './openapi';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private logoutService: LogoutService,
    private usersService: UsersService
  ) {}
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.usersService.getUser().pipe(
      catchError(() => {
        return of(null);
      }),
      map((user) => {
        if (user) {
          return true;
        }
        if (this.auth.isAuthenticated()) {
          this.logoutService.logout();
        } else {
          this.router.navigate(['/login']);
        }
        return false;
      })
    );
  }
}
