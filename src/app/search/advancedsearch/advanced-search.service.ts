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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AdvancedSearchObject } from './../../shared/models/AdvancedSearchObject';

@Injectable()
export class AdvancedSearchService {
  // toAdvanceSearch is used because this is not done correctly
  // Right now, it's used to determine whether or not to re-query elasticsearch
  // Ideally, user actions and initalization should trigger the re-query instead
  private readonly initAdvancedSearch = {
    ANDSplitFilter: '',
    ANDNoSplitFilter: '',
    ORFilter: '',
    NOTFilter: '',
    searchMode: 'files',
    toAdvanceSearch: false
  };
  advancedSearch$: BehaviorSubject<AdvancedSearchObject> = new BehaviorSubject<AdvancedSearchObject>(this.initAdvancedSearch);
  showModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  constructor() {}

  setAdvancedSearch(advancedSearch: AdvancedSearchObject): void {
    this.advancedSearch$.next(advancedSearch);
  }

  setShowModal(showModal: boolean): void {
    this.showModal$.next(showModal);
  }

  clear(): void {
    this.advancedSearch$.next(this.initAdvancedSearch);
  }
}
