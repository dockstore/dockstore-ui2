import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import {
  ContainersStubService,
  ContainerStubService,
  StateStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from './../test/service-stubs';
import { CheckerWorkflowService } from './checker-workflow.service';
import { ContainerService } from './container.service';
import { StateService } from './state.service';
import { ContainersService } from './swagger/api/containers.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { WorkflowService } from './workflow.service';

describe('Service: Service: CheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [CheckerWorkflowService,
      {provide: WorkflowsService, useClass: WorkflowsStubService},
      { provide: StateService, useClass: StateStubService},
      { provide: WorkflowService, useClass: WorkflowStubService},
      { provide: ContainerService, useClass: ContainerStubService},
      { provide: ContainersService, useClass: ContainersStubService}
      ]});
  });

  it('should ...', inject([CheckerWorkflowService], (service: CheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
