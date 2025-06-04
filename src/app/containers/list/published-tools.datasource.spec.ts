/*
 *     Copyright 2018 OICR
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

import { provideHttpClientTesting } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { ImageProviderService } from '../../shared/image-provider.service';
import { ProviderService } from '../../shared/provider.service';
import { ContainersService } from '../../shared/openapi';
import { ContainersStubService } from './../../test/service-stubs';
import { PublishedToolsDataSource } from './published-tools.datasource';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('Service: PublishedToolsDataSource', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        PublishedToolsDataSource,
        ImageProviderService,
        ProviderService,
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: ContainersService, useClass: ContainersStubService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
  });

  it('should ...', inject([PublishedToolsDataSource], (service: PublishedToolsDataSource) => {
    expect(service).toBeTruthy();
  }));
});
