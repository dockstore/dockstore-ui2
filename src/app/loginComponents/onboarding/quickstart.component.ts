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
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-onboarding',
  templateUrl: './quickstart.component.html'
})
export class QuickStartComponent implements OnInit {
  public curStep = 1;
  public tokenSetComplete;
  constructor() {
  }
  ngOnInit() {
    localStorage.setItem('page', '/quick-start');
  }
  prevStep() {
    if (this.curStep > 1) {
      this.curStep--;
    }
  }
  nextStep() {
    if (!this.tokenSetComplete) {
      return;
    }
    switch (this.curStep) {
      case 1:
      case 2:
        this.curStep++;
        break;
      default:
        localStorage.setItem('page', '/quick-start');
    }
  }

}
