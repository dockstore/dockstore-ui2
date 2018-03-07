import { inject, TestBed } from '@angular/core/testing';

import { CheckerWorkflowService } from './checker-workflow.service';

describe('Service: Service: CheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckerWorkflowService]
    });
  });

  it('should ...', inject([CheckerWorkflowService], (service: CheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
