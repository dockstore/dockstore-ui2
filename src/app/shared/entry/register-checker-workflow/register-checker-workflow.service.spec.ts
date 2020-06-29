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

import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {
  ContainerStubService,
  RefreshStubService,
  RegisterCheckerWorkflowStubService,
  WorkflowsStubService,
  WorkflowStubService
} from '../../../test/service-stubs';
import { ContainerService } from '../../container.service';
import { RefreshService } from '../../refresh.service';
import { WorkflowService } from '../../state/workflow.service';
import { WorkflowsService } from '../../swagger/api/workflows.service';
import { RegisterCheckerWorkflowService } from './register-checker-workflow.service';

describe('Service: RegisterCheckerWorkflow', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatDialogModule],
      providers: [
        { provide: RegisterCheckerWorkflowService, useClass: RegisterCheckerWorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: ContainerService, useClass: ContainerStubService },
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: RefreshService, useClass: RefreshStubService }
      ]
    });
  });

  it('should ...', inject([RegisterCheckerWorkflowService], (service: RegisterCheckerWorkflowService) => {
    expect(service).toBeTruthy();
  }));
});
