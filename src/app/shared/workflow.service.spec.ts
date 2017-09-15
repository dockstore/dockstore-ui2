import { Workflow } from './swagger/model/workflow';
import { sampleWorkflow1, sampleWorkflow2, sampleWorkflow3 } from '../test/mocked-objects';
import { WorkflowService } from './workflow.service';
import { TestBed, inject } from '@angular/core/testing';

describe('WorkflowService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WorkflowService]
        });
    });

    it('should be created', inject([WorkflowService], (service: WorkflowService) => {
        expect(service).toBeTruthy();
    }));

    it('should replace workflow', inject([WorkflowService], (service: WorkflowService) => {
        const workflows: Workflow[] = [sampleWorkflow1, sampleWorkflow2, sampleWorkflow3];
        service.setWorkflows(workflows);
        const newSampleWorkflow1: Workflow = {
            id: 1,
            'descriptorType': 'cwl',
            'gitUrl': 'replacedGitUrl',
            'mode': Workflow.ModeEnum.FULL,
            'organization': 'replacedOrganization',
            'repository': 'replacedRepository',
            'workflow_path': 'replacedWorkflowPath',
            'workflowVersions': []
        };
        service.replaceWorkflow(workflows, newSampleWorkflow1);
        expect(service.workflows$.getValue()).toEqual([newSampleWorkflow1, sampleWorkflow2, sampleWorkflow3]);
    }));

    it('should set observables', inject([WorkflowService], (service: WorkflowService) => {
        service.setCopyBtn('1');
        service.setNsWorkflows('2');
        service.setWorkflow(sampleWorkflow1);
        service.copyBtn$.subscribe(value => expect(value).toEqual('1'));
        service.nsWorkflows$.subscribe(value => expect(value).toEqual('2'));
        service.workflow$.subscribe(value => expect(value).toEqual(sampleWorkflow1));
    }));
});
