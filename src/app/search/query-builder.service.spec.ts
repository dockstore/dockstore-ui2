/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { QueryBuilderService } from './query-builder.service';

describe('Service: QueryBuilder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QueryBuilderService]
    });
  });

  it('should ...', inject([QueryBuilderService], (service: QueryBuilderService) => {
    expect(service).toBeTruthy();
  }));
});
