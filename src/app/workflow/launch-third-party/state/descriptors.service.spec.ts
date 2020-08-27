import { inject, TestBed } from '@angular/core/testing';

import { ga4ghPath } from '../../../shared/constants';
import { Dockstore } from '../../../shared/dockstore.model';
import { DescriptorsStore } from './descriptors-store';
import { DescriptorsService } from './descriptors.service';

describe('DescriptorsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DescriptorsService, DescriptorsStore]
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
      .toEqual(
        `${Dockstore.API_URI}${ga4ghPath}/tools/%23workflow%2Fgithub.com%2Fgatk-workflows%2Fgatk4-germline-snps-indels/versions/1.0.1`
      );
  }));
});
