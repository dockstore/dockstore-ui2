/**
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { inject, TestBed } from '@angular/core/testing';

import { WorkflowService } from './../../shared/workflow.service';
import { WorkflowStubService } from './../../test/service-stubs';
import { WorkflowLaunchService } from './workflow-launch.service';

describe('WorkflowLaunchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowLaunchService,
        { provide: WorkflowService, useClass: WorkflowStubService}
      ]
    });
  });

  it('should be created', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service).toBeTruthy();
  }));
  it('should getParamsString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getParamsString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow convert entry2json --entry a/b:latest > Dockstore.json');
    expect(service.getParamsString('a/b', 'latest', 'wdl')).toContain(
      'dockstore workflow convert entry2json --entry a/b:latest > Dockstore.json');
  }));
  it('should getCliString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getCliString('a/b', 'latest', 'cwl')).toContain(
      'dockstore workflow launch --entry a/b:latest --json Dockstore.json');
  }));

  it('should getCWLString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getCwlString('a/b', 'c', '%2Fpotato'))
      .toContain('cwl-runner');
    expect(service.getCwlString('a/b', 'c', '%2Fpotato'))
      .not.toContain('non-strict');
    expect(service.getCwlString('a/b', 'c', '%2Fpotato'))
      .toContain('api/ga4gh/v1/tools/%23workflow%2Fa%2Fb/versions/c/plain-CWL/descriptor/%2Fpotato Dockstore.json');
  }));
  it('should getConsonanceString', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service.getConsonanceString('a/b', 'latest')).toContain(
      'consonance run --tool-dockstore-id a/b:latest --run-descriptor Dockstore.json --flavour <AWS instance-type>');
  }));
  it('should get the right check workflow command', inject([WorkflowLaunchService], (service: WorkflowLaunchService) => {
    expect(service).toBeTruthy();
    expect(service.getCheckWorkflowString('potato', null)).toBe('$ dockstore workflow check --entry potato checkparam.json');
    expect(service.getCheckWorkflowString('potato', 'stew')).toBe('$ dockstore workflow check --entry potato:stew checkparam.json');
    expect(service.getCheckWorkflowString(null, null)).toBe('');
  }));
});
