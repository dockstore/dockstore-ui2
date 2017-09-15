import { TestBed, inject } from '@angular/core/testing';

import { WorkflowLaunchService } from './workflow-launch.service';

describe('LaunchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowLaunchService]
    });
  });

  it('should be created', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service).toBeTruthy();
  }));
  it('should getParamsString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getParamsString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow convert entry2json --entry a/b:latest > Dockstore.json');
    expect(service.getParamsString('a/b', 'latest', 'wdl')).toContain(
      'dockstore workflow convert entry2json --entry --descriptor wdl a/b:latest > Dockstore.json');
  }));
  it('should getCliString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getCliString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow launch --entry a/b:latest --json Dockstore.json');
  }));

  it('should getCWLString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getCwlString('a/b', 'c'))
      .toContain('cwltool --non-strict');
    expect(service.getCwlString('a/b', 'c'))
      .toContain('api/ga4gh/v1/tools/%23workflow%2Fa%2Fb/versions/c/plain-CWL/descriptor Dockstore.json');
  }));
  it('should getConsonanceString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getConsonanceString('a/b', 'latest')).toContain(
      'consonance run --tool-dockstore-id a/b:latest --run-descriptor Dockstore.json --flavour <AWS instance-type>');
  }));
});
