import { WorkflowService } from './../../workflow.service';
import { ContainerService } from './../../container.service';
import { WorkflowsStubService, ContainerStubService, WorkflowStubService } from './../../../test/service-stubs';
import { WorkflowsService } from './../../swagger/api/workflows.service';
import { ErrorService } from './../../error.service';
import { StateService } from './../../state.service';
import { inject, TestBed } from '@angular/core/testing';

import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

describe('Service: RegisterCheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterCheckerWorkflowService, StateService, ErrorService,
      {provide: WorkflowsService, useClass: WorkflowsStubService},
      {provide: ContainerService, useClass: ContainerStubService},
      {provide: WorkflowService, useClass: WorkflowStubService}
    ]
    });
  });

  it('should ...', inject([RegisterCheckerWorkflowService], (service: RegisterCheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
