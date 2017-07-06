import { WorkflowWebService } from './../../shared/webservice/workflow-web.service';
import { Workflow } from './../../shared/models/Workflow';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class RegisterWorkflowModalService {
    workflowRegisterError: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    friendlyRepositoryKeys = ['GitHub', 'Bitbucket', 'GitLab'];
    descriptorTypes = ['cwl', 'wdl'];
    sampleWorkflow: Workflow = new Workflow();
    actualWorkflow: Workflow;
    workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(
        this.sampleWorkflow);
    constructor(private workflowWebService: WorkflowWebService) {
        this.sampleWorkflow.repository = 'GitHub';
        this.sampleWorkflow.descriptorType = 'cwl';
        this.workflow.subscribe(workflow => this.actualWorkflow = workflow);
    }

    clearWorkflowRegisterError() {
        this.workflowRegisterError.next(null);
    }

    registerWorkflow() {
        this.workflowWebService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType).subscribe(result => console.log(result));
    }
}
