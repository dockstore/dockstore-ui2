import { inject, TestBed } from '@angular/core/testing';

import { DescriptorsService } from './descriptors.service';
import { DescriptorsStore } from './descriptors-store.';

describe('DescriptorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptorsService,
      DescriptorsStore]
    });
  });

  const path = 'github.com/gatk-workflows/gatk4-germline-snps-indels';
  const version = '1.0.1';

  it('should be created', inject([DescriptorsService], (service: DescriptorsService) => {
    expect(service).toBeTruthy();
  }));


  it('should generate correct TRS url', inject([DescriptorsService], (service: DescriptorsService) => {
    expect(service.trsUrl(path, version))
    // tslint:disable:max-line-length
      .toEqual('http://localhost:8080/api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2Fgatk-workflows%2Fgatk4-germline-snps-indels/versions/1.0.1');
  }));
});
