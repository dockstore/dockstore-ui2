/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';

describe('Service: RegisterWorkflowModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegisterWorkflowModalService]
    });
  });

  it('should ...', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    expect(service).toBeTruthy();
  }));
});