import { inject, TestBed } from '@angular/core/testing';

import { WorkflowsStubService } from './../test/service-stubs';
import { CheckerWorkflowService } from './checkerWorkflow.service';
import { WorkflowsService } from './swagger/api/workflows.service';

describe('Service: CheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckerWorkflowService,
      {provide: WorkflowsService, useClass: WorkflowsStubService}]
    });
  });

  it('should ...', inject([CheckerWorkflowService], (service: CheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
