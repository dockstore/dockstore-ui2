import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
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
    isModalShown: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    workflow: BehaviorSubject<Workflow> = new BehaviorSubject<Workflow>(
        this.sampleWorkflow);
    constructor(private workflowWebService: WorkflowWebService, private workflowsService: WorkflowsService,
        private workflowService: WorkflowService,
        private stateService: StateService) {
        this.sampleWorkflow.repository = 'GitHub';
        this.sampleWorkflow.descriptorType = 'cwl';
        this.sampleWorkflow.workflowName = '';
        this.workflow.subscribe(workflow => this.actualWorkflow = workflow);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }

    clearWorkflowRegisterError() {
        this.workflowRegisterError.next(null);
    }

    setIsModalShown(isModalShown: boolean) {
        this.isModalShown.next(isModalShown);
    }

    setWorkflowRegisterError(message: any, errorDetails) {
        const error = {
            message: message,
            errorDetails: errorDetails
        };
        this.workflowRegisterError.next(error);
    }

    setWorkflow(workflow: Workflow) {
        this.workflow.next(workflow);
    }

    setWorkflowRepository(repository) {
        this.actualWorkflow.gitUrl = repository;
        this.setWorkflow(this.actualWorkflow);
    }

    refreshWorkflow(workflowId, testParameterFilePath) {
        this.workflowWebService.refresh(workflowId).subscribe(refreshResult => {
            this.workflows.push(refreshResult);
            this.workflowService.setWorkflows(this.workflows);
            this.workflowService.setWorkflow(refreshResult);
            for (const version of refreshResult.workflowVersions) {
                this.workflowWebService.addTestParameterFiles(workflowId, [testParameterFilePath], null, version.name)
                    .subscribe();
                this.stateService.setRefreshing(false);
                this.setIsModalShown(false);
                this.clearWorkflowRegisterError();
            }
        }, error => {
            this.setWorkflowRegisterError('The webservice encountered an error trying to create this ' +
                'workflow, please ensure that the workflow attributes are ' +
                'valid and the same image has not already been registered.', '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error._body);
            this.stateService.setRefreshing(false);
        });
    }

    registerWorkflow(testParameterFilePath: string) {
        this.stateService.setRefreshing(true);
        this.workflowsService.manualRegister(
            this.actualWorkflow.repository,
            this.actualWorkflow.gitUrl,
            this.actualWorkflow.workflow_path,
            this.actualWorkflow.workflowName,
            this.actualWorkflow.descriptorType,
            testParameterFilePath).subscribe(result => {
                this.refreshWorkflow(result.id, testParameterFilePath);
            }, error => {
                this.setWorkflowRegisterError('The webservice encountered an error trying to create this ' +
                    'workflow, please ensure that the workflow attributes are ' +
                    'valid and the same image has not already been registered.', '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                    error._body);
                this.stateService.setRefreshing(false);
            }
            );
    }
}
