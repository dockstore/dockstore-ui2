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
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ProviderService } from '../../shared/provider.service';
import { ProviderStubService } from '../../test/service-stubs';
import { SearchService } from './search.service';
import { SearchStore } from './search.store';

describe('SearchService', () => {
  let searchStore: SearchStore;
  let searchService: SearchService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [SearchService, SearchStore,
        { provide: ProviderService, useClass: ProviderStubService }
      ]
    });
    searchService = TestBed.get(SearchService);
    searchStore = TestBed.get(SearchStore);
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
  it('should get term from aggergation name', inject([SearchService], (service: SearchService) => {
    expect(service.aggregationNameToTerm('agg_terms_type')).toEqual('type');
  }));
  it('should set observables', inject([SearchService], (service: SearchService) => {
    service.setSearchInfo('stuff');
    service.searchInfo$.subscribe(result => {
      expect(result).toEqual('stuff');
    });
  }));

  it('should not crash on null advancedSearchObject', inject([SearchService], (service: SearchService) => {
    expect(service.hasSearchText(null, null, null)).toEqual(false);
  }));
});
