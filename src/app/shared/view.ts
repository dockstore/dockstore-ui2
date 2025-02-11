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
import { Directive, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertQuery } from './alert/state/alert.query';
import { Base } from './base';
import { DateService } from './date.service';
import { Tag, WorkflowVersion } from './openapi';

@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class View<V = WorkflowVersion | Tag> extends Base {
  @Input() version: V;
  @Input() defaultVersion: string;
  public isRefreshing$: Observable<boolean>;

  constructor(private dateService: DateService, private alertQuery: AlertQuery) {
    super();
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }

  getDateTimeMessage(timestamp: number) {
    return this.dateService.getDateTimeMessage(timestamp);
  }
}
