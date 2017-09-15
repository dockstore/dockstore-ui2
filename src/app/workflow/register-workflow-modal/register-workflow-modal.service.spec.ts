import { StateService } from './../../shared/state.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { RegisterWorkflowModalService } from './register-workflow-modal.service';
import { StateStubService, WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { TestBed, async, inject } from '@angular/core/testing';

describe('Service: paramFiles.service.ts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RegisterWorkflowModalService,
                { provide: WorkflowService, useClass: WorkflowStubService },
                { provide: WorkflowsService, useClass: WorkflowsStubService },
                StateService
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
        stateService.refreshing.subscribe(refreshing => expect(refreshing).toBeFalsy());
    }));
    it('should set register workflow and clear refreshing state and error', inject([RegisterWorkflowModalService, StateService],
        (service: RegisterWorkflowModalService, stateService: StateService) => {
        service.registerWorkflow('/test.json');
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toEqual(false));
        service.workflowRegisterError$.subscribe(isModalShown => expect(isModalShown).toBeFalsy);
    }));
});
