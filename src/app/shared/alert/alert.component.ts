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
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AlertQuery } from './state/alert.query';
import { AlertService } from './state/alert.service';

/**
 * Stick this component into any location you want to potentially display a progress bar or alert.
 *
 * @export
 * @class AlertComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  public showError$: Observable<boolean>;
  public showInfo$: Observable<boolean>;
  public message$: Observable<string>;
  public details$: Observable<string>;

  constructor(private alertQuery: AlertQuery, private alertService: AlertService) { }

  ngOnInit() {
    this.showError$ = this.alertQuery.showError$;
    this.showInfo$ = this.alertQuery.showInfo$;
    this.message$ = this.alertQuery.message$;
    this.details$ = this.alertQuery.details$;
  }

  clear() {
    this.alertService.clearEverything();
  }
}
