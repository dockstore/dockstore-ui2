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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { first } from 'rxjs/operators';
import { ImageProviderService } from '../../shared/image-provider.service';
import { User } from '../../shared/openapi';
import { ProviderService } from '../../shared/provider.service';
import { Workflow } from '../../shared/swagger';
import { elasticSearchResponse } from '../../test/mocked-objects';
import { ProviderStubService } from '../../test/service-stubs';
import { Hit, SearchService } from './search.service';
import { SearchStore } from './search.store';

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
    service.searchInfo$.pipe(first()).subscribe(result => {
      expect(result).toEqual('stuff');
    });
  }));

  it('should not crash on null advancedSearchObject', inject([SearchService], (service: SearchService) => {
    expect(service.hasSearchText(null, null, null)).toEqual(false);
  }));

  it('should create image provider', inject(
    [SearchService, ImageProviderService],
    (service: SearchService, imageProviderService: ImageProviderService) => {
      imageProviderService.setdockerRegistryList([
        {
          customDockerPath: 'false',
          dockerPath: 'quay.io',
          enum: 'QUAY_IO',
          friendlyName: 'Quay.io',
          privateOnly: 'false',
          url: 'https://quay.io/repository/'
        },
        {
          customDockerPath: 'false',
          dockerPath: 'registry.hub.docker.com',
          enum: 'DOCKER_HUB',
          friendlyName: 'Docker Hub',
          privateOnly: 'false',
          url: 'https://hub.docker.com/'
        },
        {
          customDockerPath: 'false',
          dockerPath: 'registry.gitlab.com',
          enum: 'GITLAB',
          friendlyName: 'GitLab',
          privateOnly: 'false',
          url: 'https://gitlab.com/'
        },
        { customDockerPath: 'true', dockerPath: null, enum: 'AMAZON_ECR', friendlyName: 'Amazon ECR', privateOnly: 'true', url: null },
        { customDockerPath: 'true', dockerPath: null, enum: 'SEVEN_BRIDGES', friendlyName: 'Seven Bridges', privateOnly: 'true', url: null }
      ]);
      const filtered: [Array<Hit>, Array<Hit>] = service.filterEntry(elasticSearchResponse, 201);
      const tools = filtered[0];
      const workflows = filtered[1];
      const toolsSource = tools[0]._source;
      const workflowSource = workflows[0]._source;
      expect(toolsSource.imgProvider).toBe('Docker Hub');
      expect(toolsSource.imgProviderUrl).toBe('https://hub.docker.com/r/weischenfeldt/pcawg_delly_workflow');
      expect(workflowSource.imgProvider).toBe(undefined);
      expect(workflowSource.imgProviderUrl).toBe(undefined);
    }
  ));
  it('should sort workflows correctly', inject([SearchService], (service: SearchService) => {
    const a: Workflow = {
      author: 'a',
      gitUrl: 'https://giturl',
      mode: Workflow.ModeEnum.FULL,
      organization: '',
      repository: '',
      sourceControl: '',
      descriptorType: Workflow.DescriptorTypeEnum.CWL,
      workflow_path: '',
      defaultTestParameterFilePath: ''
    };

    const b: Workflow = { ...a, author: 'B', starredUsers: [{ isAdmin: false, curator: false, setupComplete: true }] };

    const c: Workflow = { ...a, author: null, descriptorType: Workflow.DescriptorTypeEnum.WDL };

    expect(searchService.compareAttributes(a, b, 'author', 'asc')).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'author', 'desc')).toEqual(1);
    expect(searchService.compareAttributes(b, c, 'author', 'asc')).toEqual(-1);
    expect(searchService.compareAttributes(b, c, 'author', 'desc')).toEqual(-1);
    expect(searchService.compareAttributes(a, c, 'descriptorType', 'asc')).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'descriptorType', 'desc')).toEqual(-0);
    expect(searchService.compareAttributes(a, b, 'starredUsers', 'asc')).toEqual(-1);
  }));
});
