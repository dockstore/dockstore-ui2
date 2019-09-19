import { TestBed, inject } from '@angular/core/testing';
import { MetadataService } from './metadata.service';
import { GA4GHStubService } from './../test/service-stubs';
import { GA4GHService } from './../shared/swagger/api/gA4GH.service';

describe('MetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetadataService, { provide: GA4GHService, useClass: GA4GHStubService }]
    });
  });

  it('should be created', inject([MetadataService], (metadataService: MetadataService) => {
    expect(metadataService).toBeTruthy();
  }));
});
