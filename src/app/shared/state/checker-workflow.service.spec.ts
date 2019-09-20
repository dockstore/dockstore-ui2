/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { inject, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ContainersStubService, ContainerStubService, WorkflowsStubService, WorkflowStubService } from '../../test/service-stubs';
import { CheckerWorkflowService } from './checker-workflow.service';
import { ContainerService } from '../container.service';
import { ContainersService } from '../swagger/api/containers.service';
import { WorkflowsService } from '../swagger/api/workflows.service';
import { WorkflowService } from './workflow.service';

describe('Service: Service: CheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        CheckerWorkflowService,
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: ContainersService, useClass: ContainersStubService }
      ]
    });
  });

  it('should ...', inject([CheckerWorkflowService], (service: CheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
