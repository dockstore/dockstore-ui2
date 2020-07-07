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
import { EntryTab } from '../shared/entry/entry-tab';

@Directive()
// tslint:disable-next-line: directive-class-suffix
export class Files extends EntryTab {
  @Input() id: number;
  @Input() versions: Array<any>;
  @Input() default: any;
  @Input() entrypath: string;
  @Input() publicPage: boolean;
  editing = false;
}
