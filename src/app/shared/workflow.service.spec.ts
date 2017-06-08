import { TestBed, inject } from '@angular/core/testing';

import { WorkflowObjService } from './workflow.service';

describe('WorkflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowObjService]
    });
  });

  it('should ...', inject([WorkflowObjService], (service: WorkflowObjService) => {
    expect(service).toBeTruthy();
  }));
});
