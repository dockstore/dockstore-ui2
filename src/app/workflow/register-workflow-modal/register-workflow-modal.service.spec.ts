/*
 *    Copyright 2018 OICR
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
import { RouterTestingModule } from '@angular/router/testing';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { DescriptorLanguageService } from '../../shared/entry/descriptor-language.service';
import { WorkflowService } from '../../shared/state/workflow.service';
import { ToolDescriptor } from '../../shared/openapi';
import { HostedService } from '../../shared/openapi/api/hosted.service';
import { MetadataService } from '../../shared/openapi/api/metadata.service';
import { WorkflowsService } from '../../shared/openapi/api/workflows.service';
import {
  DescriptorLanguageStubService,
  HostedStubService,
  MetadataStubService,
  WorkflowsStubService,
  WorkflowStubService,
} from '../../test/service-stubs';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';

describe('Service: RegisterWorkflowModal', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RegisterWorkflowModalService,
        { provide: WorkflowService, useClass: WorkflowStubService },
        { provide: WorkflowsService, useClass: WorkflowsStubService },
        { provide: MetadataService, useClass: MetadataStubService },
        { provide: HostedService, useClass: HostedStubService },
        { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService },
      ],
      imports: [RouterTestingModule, MatSnackBarModule],
    });
  });
  const expectedWorkflow: any = {
    repository: 'GitHub',
    descriptorType: ToolDescriptor.TypeEnum.CWL,
    gitUrl: 'asdf',
    workflowName: '',
  };

  it('should ...', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    expect(service).toBeTruthy();
  }));
  it('should be initially not visible', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    service.isModalShown$.subscribe((isModalShown) => expect(isModalShown).toBeFalsy());
  }));
  it('should be shown after set to true', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    service.setIsModalShown(true);
    service.isModalShown$.subscribe((isModalShown) => expect(isModalShown).toBeTruthy());
  }));
  it('should be no error after cleared', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    service.clearWorkflowRegisterError();
    service.workflowRegisterError$.subscribe((error) => expect(error).toBeFalsy());
  }));
  it('should have repository', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
    service.setWorkflowRepository('asdf');
    service.workflow.subscribe((workflow) => expect(workflow).toEqual(expectedWorkflow));
  }));

  it('should have not error on getDescriptorLanguageKeys()', inject(
    [RegisterWorkflowModalService],
    (service: RegisterWorkflowModalService) => {
      const descriptorLanguageKeys: Array<String> = service.getDescriptorLanguageKeys();
      expect(descriptorLanguageKeys.includes('CWL'));
      expect(descriptorLanguageKeys.includes('WDL'));
    }
  ));
});
