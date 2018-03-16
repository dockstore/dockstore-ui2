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

import { DescriptorLanguageService } from './../../shared/entry/descriptor-language.service';
import { StateService } from './../../shared/state.service';
import { MetadataService } from './../../shared/swagger/api/metadata.service';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import {
    DescriptorLanguageStubService,
    MetadataStubService,
    WorkflowsStubService,
    WorkflowStubService,
} from './../../test/service-stubs';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';

describe('Service: RegisterWorkflowModal', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegisterWorkflowModalService,
                { provide: WorkflowService, useClass: WorkflowStubService },
                { provide: WorkflowsService, useClass: WorkflowsStubService },
                { provide: MetadataService, useClass: MetadataStubService },
                StateService,
                { provide: DescriptorLanguageService, useClass: DescriptorLanguageStubService }
            ]
        });
    });
    const expectedError: any = {
        'message': 'oh no!',
        'errorDetails': 'oh yes'
    };
    const expectedWorkflow: any = {
        'repository': 'GitHub',
        'descriptorType': 'cwl',
        'gitUrl': 'asdf',
        'workflowName': ''
    };

    it('should ...', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
        expect(service).toBeTruthy();
    }));
    it('should be initially not visible', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeFalsy());
    }));
    it('should be shown after set to true', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
        service.setIsModalShown(true);
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeTruthy());
    }));
    it('should be no error after cleared', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
        service.clearWorkflowRegisterError();
        service.workflowRegisterError$.subscribe(error => expect(error).toBeFalsy());
    }));
    it('should have repository', inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
        service.setWorkflowRepository('asdf');
        service.workflow.subscribe(workflow => expect(workflow).toEqual(expectedWorkflow));
    }));
    it('should set register error and clear refreshing state', inject([RegisterWorkflowModalService, StateService],
        (service: RegisterWorkflowModalService, stateService: StateService) => {
            service.setWorkflowRegisterError('oh no!', 'oh yes');
            service.workflowRegisterError$.subscribe(error => expect(error).toEqual(expectedError));
            stateService.refreshMessage$.subscribe(refreshMessage => expect(refreshMessage).toBeFalsy());
        }));
    it('should set register workflow and clear refreshing state and error', inject([RegisterWorkflowModalService, StateService],
        (service: RegisterWorkflowModalService, stateService: StateService) => {
            service.registerWorkflow();
            service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toEqual(false));
            service.workflowRegisterError$.subscribe(isModalShown => expect(isModalShown).toBeFalsy);
        }));
    it('should have not error on getDescriptorLanguageKeys()',
        inject([RegisterWorkflowModalService], (service: RegisterWorkflowModalService) => {
            const descriptorLanguageKeys: Array<String> = service.getDescriptorLanguageKeys();
            expect(descriptorLanguageKeys.includes('CWL'));
            expect(descriptorLanguageKeys.includes('WDL'));
        }));
});
