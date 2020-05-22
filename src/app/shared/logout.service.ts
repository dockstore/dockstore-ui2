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
import { Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';

import { TrackLoginService } from './track-login.service';
import { UserService } from './user/user.service';

@Injectable()
export class LogoutService {
  constructor(
    private trackLoginService: TrackLoginService,
    private router: Router,
    private userService: UserService,
    private auth: AuthService
  ) {}

  logout(routeChange?: string) {
    this.auth.logout().subscribe({
      complete: () => {
        this.userService.remove();
        this.trackLoginService.switchState(false);
        routeChange ? this.router.navigate([routeChange]) : this.router.navigate(['/logout']);
      }
    });
  }
}
