import { StateService } from './../../shared/state.service';
import { WorkflowService } from './../../shared/workflow.service';
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
    workflows: any;
    workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(
        this.sampleWorkflow);
    constructor(private workflowWebService: WorkflowWebService,
        private workflowService: WorkflowService,
        private stateService: StateService) {
        this.sampleWorkflow.repository = 'GitHub';
        this.sampleWorkflow.descriptorType = 'cwl';
        this.workflow.subscribe(workflow => this.actualWorkflow = workflow);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }

    clearWorkflowRegisterError() {
        this.workflowRegisterError.next(null);
    }

    setWorkflowRegisterError(error: any) {
        this.workflowRegisterError = error;
    }

    registerWorkflow() {
        this.stateService.setRefreshing(true);
        this.workflowWebService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType).subscribe(result => {
                this.workflowService.setWorkflow(result);
                this.workflows.push(result);
                this.workflowService.setWorkflows(this.workflows);
                this.workflowService.setWorkflow(result);
                this.stateService.setRefreshing(false);
            }, error => this.setWorkflowRegisterError(error));
    }
}
