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

import { SearchStubService } from './../test/service-stubs';
/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { QueryBuilderService } from './query-builder.service';
import { SearchService } from './state/search.service';

describe('Service: QueryBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryBuilderService, { provide: SearchService, useClass: SearchStubService }],
    });
  });

  it('should ...', inject([QueryBuilderService], (service: QueryBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
