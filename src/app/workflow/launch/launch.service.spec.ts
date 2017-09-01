import { TestBed, inject } from '@angular/core/testing';

import { LaunchService } from './launch.service';

describe('LaunchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LaunchService]
    });
  });

  it('should be created', inject([LaunchService], (service: LaunchService) => {
    expect(service).toBeTruthy();
  }));
  it('should getParamsString', inject([LaunchService], (service: LaunchService) => {
    expect(service.getParamsString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow convert entry2json --entry a/b:latest > Dockstore.json');
    expect(service.getParamsString('a/b', 'latest', 'wdl')).toContain(
      'dockstore workflow convert entry2json --entry --descriptor wdl a/b:latest > Dockstore.json');
  }));
  it('should getCliString', inject([LaunchService], (service: LaunchService) => {
    expect(service.getCliString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow launch --entry a/b:latest --json Dockstore.json');
  }));

  it('should getCWLString', inject([LaunchService], (service: LaunchService) => {
    expect(service.getCwlString('a/b', 'c'))
      .toContain('cwltool --non-strict');
    expect(service.getCwlString('a/b', 'c'))
      .toContain('api/ga4gh/v1/tools/%23workflow%2Fa%2Fb/versions/c/plain-CWL/descriptor Dockstore.json');
  }));
  it('should getConsonanceString', inject([LaunchService], (service: LaunchService) => {
    expect(service.getConsonanceString('a/b', 'latest')).toContain(
      'consonance run --tool-dockstore-id a/b:latest --run-descriptor Dockstore.json --flavour <AWS instance-type>');
  }));
});
