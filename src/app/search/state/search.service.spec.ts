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
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { first } from 'rxjs/operators';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ProviderService } from '../../shared/provider.service';
import { EntryType, Workflow } from '../../shared/openapi';
import { elasticSearchResponse } from '../../test/mocked-objects';
import { ProviderStubService } from '../../test/service-stubs';
import { Hit, SearchService } from './search.service';
import { SearchStore } from './search.store';
import { SearchAuthorsHtmlPipe } from '../search-authors-html.pipe';

describe('SearchService', () => {
  let searchService: SearchService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule, MatSnackBarModule],
      providers: [
        ImageProviderService,
        SearchService,
        SearchStore,
        SearchAuthorsHtmlPipe,
        {
          provide: ProviderService,
          useClass: ProviderStubService,
        },
      ],
    });
    searchService = TestBed.inject(SearchService);
    TestBed.inject(SearchStore);
  });

  it('should be created', inject([SearchService], (service: SearchService) => {
    expect(service).toBeTruthy();
  }));
  it('should get term from aggregation name', inject([SearchService], (service: SearchService) => {
    expect(service.aggregationNameToTerm('agg_terms_type')).toEqual('type');
  }));
  it('should set observables', inject([SearchService], (service: SearchService) => {
    service.setSearchInfo('stuff');
    service.searchInfo$.pipe(first()).subscribe((result) => {
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
          url: 'https://quay.io/repository/',
        },
        {
          customDockerPath: 'false',
          dockerPath: 'registry.hub.docker.com',
          enum: 'DOCKER_HUB',
          friendlyName: 'Docker Hub',
          privateOnly: 'false',
          url: 'https://hub.docker.com/',
        },
        {
          customDockerPath: 'false',
          dockerPath: 'registry.gitlab.com',
          enum: 'GITLAB',
          friendlyName: 'GitLab',
          privateOnly: 'false',
          url: 'https://gitlab.com/',
        },
        {
          customDockerPath: 'true',
          dockerPath: 'public.ecr.aws',
          enum: 'AMAZON_ECR',
          friendlyName: 'Amazon ECR',
          privateOnly: 'false',
          url: 'https://gallery.ecr.aws/',
        },
        {
          customDockerPath: 'true',
          dockerPath: null,
          enum: 'SEVEN_BRIDGES',
          friendlyName: 'Seven Bridges',
          privateOnly: 'true',
          url: null,
        },
      ]);
      const filtered: [Array<Hit>, Array<Hit>, Array<Hit>] = service.filterEntry(elasticSearchResponse, 201);
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
      type: '',
      authors: [{ name: 'a' }],
      gitUrl: 'https://giturl',
      mode: Workflow.ModeEnum.FULL,
      organization: '',
      repository: '',
      sourceControl: null,
      descriptorType: Workflow.DescriptorTypeEnum.CWL,
      workflow_path: '',
      defaultTestParameterFilePath: '',
      descriptorTypeSubclass: Workflow.DescriptorTypeSubclassEnum.NA,
      full_workflow_path: 'abc',
    };
    a['all_authors'] = a['authors'];

    const b: Object = {
      ...a,
      authors: [{ name: 'B' }],
      full_workflow_path: 'Bcd',
      starredUsers: [{ isAdmin: false, curator: false, platformPartner: null, setupComplete: true }],
    };
    b['all_authors'] = b['authors'];

    const c: Workflow = { ...a, authors: [], full_workflow_path: null, descriptorType: Workflow.DescriptorTypeEnum.WDL };
    c['all_authors'] = c['authors'];

    expect(searchService.compareAttributes(a, b, 'all_authors', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'all_authors', 'desc', EntryType.WORKFLOW)).toEqual(1);
    expect(searchService.compareAttributes(b, c, 'all_authors', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    // when all_authors is [], compareAttributes converts the value to 'n/a', which should be sorted last
    expect(searchService.compareAttributes(b, c, 'all_authors', 'desc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(a, c, 'descriptorType', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'descriptorType', 'desc', EntryType.WORKFLOW)).toEqual(-0);
    expect(searchService.compareAttributes(a, b, 'starredUsers', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'name', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(a, b, 'name', 'desc', EntryType.WORKFLOW)).toEqual(1);
    expect(searchService.compareAttributes(b, c, 'name', 'asc', EntryType.WORKFLOW)).toEqual(-1);
    expect(searchService.compareAttributes(b, c, 'name', 'desc', EntryType.WORKFLOW)).toEqual(-1);
  }));
});
