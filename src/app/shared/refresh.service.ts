import { WorkflowWebService } from './webservice/workflow-web.service';
import { WorkflowService } from './workflow.service';
import { Injectable } from '@angular/core';

import { ContainerService } from './container.service';
import { ContainersWebService } from './webservice/containers-web.service';
import { StateService } from './state.service';
import { UsersWebService } from './webservice/users-web.service';

@Injectable()
export class RefreshService {
    private tool;
    private refreshing: boolean;
    private workflows;
    constructor(private containerWebService: ContainersWebService,
    private WorkflowWebService: WorkflowWebService,
        private containerService: ContainerService,
        private stateService: StateService,
        private usersService: UsersWebService,
        private workflowService: WorkflowService) {
        this.containerService.tool$.subscribe(
            tool => this.tool = tool
        );
        this.stateService.refreshing.subscribe(
            refreshing => {
                this.refreshing = refreshing;
            }
        );
        this.workflowService.workflows$.subscribe(
            workflows => this.workflows = workflows
        );
    }
    refreshContainer() {
        this.stateService.refreshing.next(true);
        this.containerWebService.getContainerRefresh(this.tool.id).subscribe(
            response => {
                this.containerService.setTool(response);
                this.stateService.refreshing.next(false);
            }
        );
    }

    refreshWorkflow(id: number) {
        this.stateService.refreshing.next(true);
        this.WorkflowWebService.refresh(id).subscribe(response => {
            this.replaceWorkflow(response);
            this.workflowService.setWorkflow(response);
            this.stateService.refreshing.next(false);
        });
    }

    refreshAllTools(id: number) {
        this.stateService.refreshing.next(true);
        this.usersService.refresh(id).subscribe(
            response => {
                this.containerService.setTools(response);
                this.stateService.refreshing.next(false);
            }
        );
    }

    refreshAllWorkflows(id: number) {
        this.stateService.refreshing.next(true);
        this.usersService.refreshWorkflows(id).subscribe(
            response => {
                this.workflowService.setWorkflows(response);
                this.stateService.refreshing.next(false);
            }
        );
    }

    /**
     * The list of workflows is outdated.
     * Replace outdated workflow with the same id with the updated workflow.
     * Should probably move this to a more general service.
     * @param {*} workflow  The updated workflow
     * @memberof RefreshService
     */
    replaceWorkflow(workflow: any) {
        this.workflows = this.workflows.filter(obj => obj.id !== workflow.id);
        this.workflows.push(workflow);
        this.workflowService.setWorkflows(this.workflows);
    }
}
