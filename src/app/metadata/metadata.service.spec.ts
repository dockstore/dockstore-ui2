import { TestBed, inject } from '@angular/core/testing';
import { GA4GHStubService } from './../test/service-stubs';

import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: MetadataService, useClass: GA4GHStubService}]
    });
  });

  it('should be created', inject([MetadataService], (service: MetadataService) => {
    expect(service).toBeTruthy();
  }));
});
