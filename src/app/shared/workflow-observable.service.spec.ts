import { TestBed, inject } from '@angular/core/testing';

import { WorkflowObservableService } from './workflow-observable.service';

describe('WorkflowService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowObservableService]
    });
  });

  it('should ...', inject([WorkflowObservableService], (service: WorkflowObservableService) => {
    expect(service).toBeTruthy();
  }));
});
