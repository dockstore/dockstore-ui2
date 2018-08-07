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

import { UserService } from './../loginComponents/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TrackLoginService } from '../shared/track-login.service';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-login',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  constructor(private trackLoginService: TrackLoginService,
              private authService: RegisterService,
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

  registerWithGitHub() {
    this.login(this.authService.authenticate('github'));
  }

  public registerWithGoogle() {
    this.login(this.authService.authenticate('google'));
  }
}
