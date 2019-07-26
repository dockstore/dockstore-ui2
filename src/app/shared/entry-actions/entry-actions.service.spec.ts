import { inject, TestBed } from '@angular/core/testing';
import { ContainersStubService, ContainerStubService, WorkflowsStubService, WorkflowStubService } from 'app/test/service-stubs';
import { ContainerService } from '../container.service';
import { CustomMaterialModule } from '../modules/material.module';
import { WorkflowService } from '../state/workflow.service';
import { ContainersService, WorkflowsService } from '../swagger';
import { EntryActionsService } from './entry-actions.service';

describe('Service: EntryActionsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EntryActionsService,
        {
          provide: WorkflowsService,
          useClass: WorkflowsStubService
        },
        {
          provide: WorkflowService,
          useClass: WorkflowStubService
        },
        {
          provide: ContainersService,
          useClass: ContainersStubService
        },
        {
          provide: ContainerService,
          useClass: ContainerStubService
        }
      ],
      imports: [CustomMaterialModule]
    });
  });

  it('should ...', inject([EntryActionsService], (service: EntryActionsService) => {
    expect(service).toBeTruthy();
  }));
});
