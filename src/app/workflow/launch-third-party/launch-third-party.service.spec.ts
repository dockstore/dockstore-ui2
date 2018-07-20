import { TestBed, inject } from '@angular/core/testing';

import { LaunchThirdPartyService } from './launch-third-party.service';
import { Dockstore } from '../../shared/dockstore.model';

describe('LaunchThirdPartyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaunchThirdPartyService]
    });
  });

  const path = 'github.com/gatk-workflows/gatk4-germline-snps-indels';
  const version = '1.0.1';

  it('should be created', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    expect(service).toBeTruthy();
  }));

  it('should create encoded DNAnexus url', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    const dnanexusUrl = service.dnanexusUrl(path, version);
    const expectedEncodedSourcePath =
      'api/ga4gh/v2/tools/%23workflow%2Fgithub.com%2Fgatk-workflows%2Fgatk4-germline-snps-indels/versions/1.0.1';
    expect(dnanexusUrl).toBe(`${Dockstore.DNANEXUS_IMPORT_URL}?source=${Dockstore.API_URI}/${expectedEncodedSourcePath}`);
  }));

  it('should create encoded DNAstack url', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    const expected = 'https://app.dnastack.com/#/app/workflow/import/dockstore?path=github.com/gatk-workflows/'
      + 'gatk4-germline-snps-indels&descriptorType=wdl';
    expect(service.dnastackUrl(path, 'wdl'))
      .toBe(expected);
  }));

  it('should create Firecloud url', inject([LaunchThirdPartyService], (service: LaunchThirdPartyService) => {
    // The host is configurable, so just test from #import on
    const importPart = '#import/dockstore/github.com/gatk-workflows/gatk4-germline-snps-indels:1.0.1';
    expect(service.firecloudUrl(path, version).indexOf(importPart)).toBeGreaterThan(-1);
  }));
});
