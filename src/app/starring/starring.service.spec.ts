import { inject, TestBed } from '@angular/core/testing';

import { ContainersService } from '../shared/swagger';
import { UsersService } from './../shared/swagger/api/users.service';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';
import { ContainersStubService, UsersStubService, WorkflowsStubService } from './../test/service-stubs';
import { StarringService } from './starring.service';

describe('StarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StarringService,
        {provide: ContainersService, useClass: ContainersStubService},
        {provide: WorkflowsService, useClass: WorkflowsStubService},
        {provide: UsersService, useClass: UsersStubService}
      ]
    });
  });

  it('should be created', inject([StarringService], (service: StarringService) => {
    expect(service).toBeTruthy();
  }));
  it('should call everything', inject([StarringService], (service: StarringService) => {
    service.setStar(1, 'workflows');
    service.setStar(1, 'containers');
    service.setUnstar(1, 'workflows');
    service.setUnstar(1, 'containers');
    service.getStarring(1, 'workflows');
    service.getStarring(1, 'containers');
    service.getStarredTools();
    service.getStarredWorkflows();
  }));
});
