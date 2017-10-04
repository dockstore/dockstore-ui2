import { SearchStubService } from './../test/service-stubs';
import { SearchService } from './search.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueryBuilderService } from './query-builder.service';

describe('Service: QueryBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryBuilderService, {provide: SearchService, useClass: SearchStubService}]
    });
  });

  it('should ...', inject([QueryBuilderService], (service: QueryBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
