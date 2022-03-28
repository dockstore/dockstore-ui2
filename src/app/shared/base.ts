/*
 *    Copyright 2019 OICR
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
import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * This class allows other components to easily unsubscribe from it.
 * One day, when we stop subscribing from within components (by doing so in services instead),
 * this class easily shows which components will need to be changed later on (even though services can extend it too)
 *
 * @export
 * @abstract
 * @class Base
 * @implements {OnDestroy}
 */
@Directive()
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class Base implements OnDestroy {
  protected ngUnsubscribe: Subject<{}> = new Subject();

  constructor() {}

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
