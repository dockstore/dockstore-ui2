import { ModalDirective } from 'ngx-bootstrap/modal';
import { StateService } from './../../shared/state.service';
import { WorkflowService } from './../../shared/workflow.service';
import { WorkflowWebService } from './../../shared/webservice/workflow-web.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class RegisterWorkflowModalService {
    workflowRegisterError: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    friendlyRepositoryKeys = ['GitHub', 'Bitbucket', 'GitLab'];
    descriptorTypes = ['cwl', 'wdl'];
    sampleWorkflow: Workflow = <Workflow>{};
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

    setWorkflowRegisterError(message: any, errorDetails) {
        const error = {
            message: message,
            errorDetails: errorDetails
        };
        this.workflowRegisterError.next(error);
    }

    registerWorkflow(modal: ModalDirective, testParameterFilePath: string) {
        this.stateService.setRefreshing(true);
        this.workflowWebService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType).subscribe(result => {
                this.workflowWebService.refresh(result.id).subscribe(refreshResult => {
                    this.workflows.push(refreshResult);
                    this.workflowService.setWorkflows(this.workflows);
                    this.workflowService.setWorkflow(refreshResult);
                    for (const version of refreshResult.workflowVersions){
                        this.workflowWebService.addTestParameterFiles(result.id, [testParameterFilePath], null, version.name)
                        .subscribe();
                    this.stateService.setRefreshing(false);
                    modal.hide();
                    this.clearWorkflowRegisterError();
                    }
                });
            }, error => this.setWorkflowRegisterError('The webservice encountered an error trying to create this ' +
                'workflow, please ensure that the workflow attributes are ' +
                'valid and the same image has not already been registered.', '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error._body)
            );
    }
}
