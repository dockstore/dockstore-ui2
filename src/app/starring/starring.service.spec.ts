/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { inject, TestBed } from '@angular/core/testing';
import { EntryType } from 'app/shared/enum/entry-type';
import { ContainersService } from '../shared/swagger';
import { UsersService } from './../shared/swagger/api/users.service';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';
import { ContainersStubService, UsersStubService, WorkflowsStubService } from './../test/service-stubs';
import { StarringService } from './starring.service';

describe('StarringService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StarringService,
        { provide: ContainersService, useClass: ContainersStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: UsersService, useClass: UsersStubService }
      ]
    });
  });

  it('should be created', inject([StarringService], (service: StarringService) => {
    expect(service).toBeTruthy();
  }));
  it('should call everything', inject([StarringService], (service: StarringService) => {
    service.setStar(1, EntryType.BioWorkflow);
    service.setStar(1, EntryType.Tool);
    service.setUnstar(1, EntryType.BioWorkflow);
    service.setUnstar(1, EntryType.Tool);
    service.getStarring(1, EntryType.BioWorkflow);
    service.getStarring(1, EntryType.Tool);
    service.getStarredTools();
    service.getStarredWorkflows();
  }));
});
