import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { VersionModalService } from './version-modal.service';
import { StateService } from './../../shared/state.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowService } from './../../shared/workflow.service';
import { StateStubService, WorkflowsStubService, WorkflowStubService } from './../../test/service-stubs';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { TestBed, async, inject } from '@angular/core/testing';

describe('Service: paramFiles.service.ts', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [VersionModalService,
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
    const expectedVersion: WorkflowVersion = {
        'name': 'expectedName',
        'reference': 'expectedReference'
    };
    it('should ...', inject([VersionModalService], (service: VersionModalService) => {
        expect(service).toBeTruthy();
    }));
    it('should be initially not visible', inject([VersionModalService], (service: VersionModalService) => {
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeFalsy());
    }));
    it('should be shown after set to true', inject([VersionModalService], (service: VersionModalService) => {
        service.setIsModalShown(true);
        service.isModalShown$.subscribe(isModalShown => expect(isModalShown).toBeTruthy());
    }));
    it('should be able to set version', inject([VersionModalService], (service: VersionModalService) => {
        service.setVersion(expectedVersion);
        service.version.subscribe(version => expect(version).toEqual(expectedVersion));
    }));
    it('should be able to set test parameter files', inject([VersionModalService], (service: VersionModalService) => {
        service.setTestParameterFiles([]);
        service.testParameterFiles.subscribe(files => expect(files).toEqual([]));
    }));
    it('should bel able to save version and clear refreshing state', inject([VersionModalService, StateService],
        (service: VersionModalService, stateService: StateService) => {
        service.saveVersion(expectedVersion, ['a', 'b'], ['b', 'c']);
        stateService.refreshMessage$.subscribe(refreshMessage => expect(refreshMessage).toBeFalsy());
    }));

});
