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
import { elasticSearchResponse } from '../../test/mocked-objects';
import { RouterTestingModule } from '@angular/router/testing';
import { ProviderService } from '../../shared/provider.service';
import { ProviderStubService } from '../../test/service-stubs';
import { SearchService } from './search.service';
import { SearchStore } from './search.store';
import { ImageProviderService } from '../../shared/image-provider.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('SearchService', () => {
  let searchStore: SearchStore;
  let searchService: SearchService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        ImageProviderService,
        SearchService,
        SearchStore,
        {
          provide: ProviderService,
          useClass: ProviderStubService
        }
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

  it('should create image provider', inject([SearchService], (service: SearchService) => {
    const filtered: [Array<any>, Array<any>] = service.filterEntry(elasticSearchResponse, 201);
    const tools = filtered[0];
    const workflows = filtered[1];
    const toolsSource = tools[0]._source;
    const workflowSource = workflows[0]._source;
    expect(toolsSource.imgProvider).toBe('Docker Hub');
    expect(toolsSource.imgProviderUrl).toBe('https://hub.docker.com/r/weischenfeldt/pcawg_delly_workflow');
    expect(workflowSource.imgProvider).toBe(undefined);
    expect(workflowSource.imgProviderUrl).toBe(undefined);
  }));
});
