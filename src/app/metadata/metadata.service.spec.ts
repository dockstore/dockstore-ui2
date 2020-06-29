import { inject, TestBed } from '@angular/core/testing';
import { GA4GHService } from './../shared/swagger/api/gA4GH.service';
import { GA4GHStubService } from './../test/service-stubs';
import { MetadataService } from './metadata.service';

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
