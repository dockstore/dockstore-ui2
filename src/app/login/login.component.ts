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
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { RegisterService } from '../register/register.service';
import { TrackLoginService } from '../shared/track-login.service';
import { UserService } from './../loginComponents/user.service';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private trackLoginService: TrackLoginService,
    private loginService: LoginService, private registerService: RegisterService,
    private router: Router, private userService: UserService) { }

  private login(observable) {
    observable.subscribe(
      (response) => {
        this.trackLoginService.switchState(true);
        this.userService.updateUser();
        this.router.navigate(['/onboarding']);
      },
      (error) => {
        console.log('Authentication error: ' + error);
      }
    );
  }

  loginWithGitHub() {
    this.login(this.loginService.authenticate('github'));
  }

  public loginWithGoogle() {
    this.login(this.loginService.authenticate('google'));
  }

  registerWithGitHub() {
    this.login(this.registerService.authenticate('github'));
  }

  registerWithGoogle() {
    this.login(this.registerService.authenticate('google'));
  }
}
