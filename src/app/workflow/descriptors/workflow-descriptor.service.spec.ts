import { WorkflowsStubService } from './../../test/service-stubs';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WorkflowDescriptorService } from './workflow-descriptor.service';

describe('Service: WorkflowDescriptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowDescriptorService,
        { provide: WorkflowsService, useClass: WorkflowsStubService }
      ]
    });
  });

  it('should ...', inject([WorkflowDescriptorService], (service: WorkflowDescriptorService) => {
    expect(service).toBeTruthy();
  }));
});
