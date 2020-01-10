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
import { Input, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { DateService } from './date.service';
import { Tag, WorkflowVersion } from './swagger';

export abstract class View implements OnDestroy {
  @Input() version: WorkflowVersion | Tag;

  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor(private dateService: DateService) {}

  getDateTimeMessage(timestamp) {
    return this.dateService.getDateTimeMessage(timestamp);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
