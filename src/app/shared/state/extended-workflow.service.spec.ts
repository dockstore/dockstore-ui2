/*
 *    Copyright 2018 OICR
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

import { sampleWorkflow1 } from '../../test/mocked-objects';
import { DateStubService, DockstoreStubService, ImageProviderStubService, ProviderStubService } from '../../test/service-stubs';
import { WorkflowStubService } from '../../test/service-stubs';
import { DateService } from '../date.service';
import { DockstoreService } from '../dockstore.service';
import { ImageProviderService } from '../image-provider.service';
import { ExtendedWorkflow } from '../models/ExtendedWorkflow';
import { ProviderService } from '../provider.service';
import { ExtendedWorkflowService } from './extended-workflow.service';
import { WorkflowService } from './workflow.service';

describe('Service: ExtendedWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ExtendedWorkflowService,
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: DateService, useClass: DateStubService },
        { provide: DockstoreService, useClass: DockstoreStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ImageProviderService, useClass: ImageProviderStubService },
      ],
    });
  });

  it('should ...', inject([ExtendedWorkflowService], (service: ExtendedWorkflowService) => {
    expect(service).toBeTruthy();
  }));

  it('should populate properties', inject([ExtendedWorkflowService], (service: ExtendedWorkflowService) => {
    const extendedWorkflow: ExtendedWorkflow = service.extendWorkflow(sampleWorkflow1);
    expect(extendedWorkflow.agoMessage).toEqual('an ago message');
    expect(extendedWorkflow.email).toEqual('stripped email');
    expect(extendedWorkflow.versionVerified).toEqual(true);
    expect(extendedWorkflow.verifiedSources).toEqual([{ version: 'c', verifiedSource: 'tester' }]);
    expect(extendedWorkflow.provider).toEqual('a provider');
    expect(extendedWorkflow.providerUrl).toEqual('a provider url');
  }));
});
