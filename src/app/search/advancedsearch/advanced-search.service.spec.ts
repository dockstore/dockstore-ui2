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

import { AdvancedSearchObject } from '../../shared/models/AdvancedSearchObject';
import { AdvancedSearchService } from './advanced-search.service';
import { TestBed, inject } from '@angular/core/testing';

describe('AdvancedSearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdvancedSearchService]
    });
  });

  it('should be created', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
    expect(service).toBeTruthy();
  }));
  it('should be set observables', inject([AdvancedSearchService], (service: AdvancedSearchService) => {
    const object1: AdvancedSearchObject = {
      ANDSplitFilter: '',
      ANDNoSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'files',
      toAdvanceSearch: false
    };
    const object2: AdvancedSearchObject = {
      ANDSplitFilter: '',
      ANDNoSplitFilter: '',
      ORFilter: '',
      NOTFilter: '',
      searchMode: 'files',
      toAdvanceSearch: true
    };
    expect(service.showModal$.getValue()).toBeFalsy();
    expect(service.advancedSearch$.getValue()).toEqual(object1);
    service.setAdvancedSearch(object2);
    service.setShowModal(true);
    expect(service.advancedSearch$.getValue()).toEqual(object2);
    expect(service.showModal$.getValue()).toBeTruthy();
    service.clear();
    expect(service.advancedSearch$.getValue()).toEqual(object1);
    // service.advancedSearch$.subscribe(object => expect(object).toEqual(object1));
  }));
});
