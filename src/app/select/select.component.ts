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

import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html'
})
export class SelectComponent implements OnChanges {
  @Input() items: Array<any>;
  @Input() field?;
  @Input() default?: any;
  @Input() placeholder?: string;

  @Output() select: EventEmitter<any> = new EventEmitter();

  obj: any;

  ngOnChanges() {
    this.obj = this.default;
  }

  changedSelect(obj) {
    this.select.emit(obj);
  }
}
