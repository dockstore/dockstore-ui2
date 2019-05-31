/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { WorkflowService } from '../shared/state/workflow.service';
import { WorkflowsService } from '../shared/swagger';
import { WorkflowsStubService, WorkflowStubService } from '../test/service-stubs';
import { MyServicesService } from './my-services.service';

describe('Service: MyServices', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MyServicesService,
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService }
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
  });

  it('should ...', inject([MyServicesService], (service: MyServicesService) => {
    expect(service).toBeTruthy();
  }));
});
