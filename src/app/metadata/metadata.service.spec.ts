import { inject, TestBed } from '@angular/core/testing';
import { GA4GHV20Service } from './../shared/openapi';
import { GA4GHV20StubService } from './../test/service-stubs';
import { MetadataService } from './metadata.service';

describe('MetadataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MetadataService, { provide: GA4GHV20Service, useClass: GA4GHV20StubService }],
    });
  });

  it('should be created', inject([MetadataService], (metadataService: MetadataService) => {
    expect(metadataService).toBeTruthy();
  }));
});
