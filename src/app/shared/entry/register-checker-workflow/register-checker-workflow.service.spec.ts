import { ErrorService } from './../../error.service';
import { StateService } from './../../state.service';
import { inject, TestBed } from '@angular/core/testing';

import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

describe('Service: RegisterCheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterCheckerWorkflowService, StateService, ErrorService]
    });
  });

  it('should ...', inject([RegisterCheckerWorkflowService], (service: RegisterCheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
