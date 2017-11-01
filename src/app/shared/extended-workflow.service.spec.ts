import { inject, TestBed } from '@angular/core/testing';

import { WorkflowStubService } from '../test/service-stubs';
import { sampleWorkflow1 } from './../test/mocked-objects';
import {
    DateStubService,
    DockstoreStubService,
    ImageProviderStubService,
    ProviderStubService,
} from './../test/service-stubs';
import { DateService } from './date.service';
import { DockstoreService } from './dockstore.service';
import { ExtendedWorkflowService } from './extended-workflow.service';
import { ImageProviderService } from './image-provider.service';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { ProviderService } from './provider.service';
import { WorkflowService } from './workflow.service';

describe('Service: ExtendedWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExtendedWorkflowService,
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: DateService, useClass: DateStubService },
        { provide: DockstoreService, useClass: DockstoreStubService },
        { provide: ProviderService, useClass: ProviderStubService },
        { provide: ImageProviderService, useClass: ImageProviderStubService }
      ]
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
