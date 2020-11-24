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
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';

import { ExtendedDockstoreTool } from '../models/ExtendedDockstoreTool';
import { ExtendedDockstoreToolStore } from './extended-dockstoreTool.store';

@Injectable({
  providedIn: 'root',
})
export class ExtendedDockstoreToolQuery extends Query<ExtendedDockstoreTool> {
  extendedDockstoreTool$: Observable<ExtendedDockstoreTool> = this.select();
  constructor(protected store: ExtendedDockstoreToolStore) {
    super(store);
  }
}
