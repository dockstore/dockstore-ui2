import { ErrorService } from './../container/error.service';
import { Injectable } from '@angular/core';

import { WorkflowsService } from './swagger/api/workflows.service';
import { UsersService } from './swagger/api/users.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from './swagger/model/workflow';
import { ContainersService } from './swagger/api/containers.service';

import { WorkflowService } from './workflow.service';
import { ContainerService } from './container.service';
import { StateService } from './state.service';

@Injectable()
export class RefreshService {
    private tool: DockstoreTool;
    private tools;
    private workflow: Workflow;
    private workflows;
    private refreshing: boolean;
    constructor(private WorkflowsService: WorkflowsService, private containerService: ContainerService, private stateService: StateService,
        private workflowService: WorkflowService, private containersService: ContainersService, private usersService: UsersService,
        private errorService: ErrorService) {
        this.containerService.tool$.subscribe(tool => this.tool = tool);
        this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
        this.containerService.tools$.subscribe(tools => this.tools = tools);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
        this.stateService.refreshing$.subscribe(refreshing => this.refreshing = refreshing);
    }

    /**
     * Handles refreshing of tool and updates the view.
     * @memberof RefreshService
     */
    refreshTool() {
        this.stateService.setRefreshMessage('Refreshing ' + this.tool.path + ' ...');
        this.containersService.refresh(this.tool.id).subscribe((response: DockstoreTool) => {
            this.containerService.replaceTool(this.tools, response);
            this.containerService.setTool(response);
            this.stateService.setRefreshMessage(null);
        }, error => {
            this.errorService.setToolRegisterError(error);
            this.stateService.setRefreshMessage(null);
        });
    }

    /**
     * Handles refreshing of the workflow and updates the view.
     * @memberof RefreshService
     */
    refreshWorkflow() {
        this.stateService.setRefreshMessage('Refreshing ' + this.workflow.path + ' ...');
        this.WorkflowsService.refresh(this.workflow.id).subscribe((response: Workflow) => {
            this.workflowService.replaceWorkflow(this.workflows, response);
            this.workflowService.setWorkflow(response);
            this.stateService.setRefreshMessage(null);
        }, error => {
            this.errorService.setToolRegisterError(error);
            this.stateService.setRefreshMessage(null);
        });
    }


    /**
     * Handles refreshing of all the tools and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllTools(userId: number) {
        this.stateService.setRefreshMessage('Refreshing all tools...');
        this.usersService.refresh(userId).subscribe(
            response => {
                this.containerService.setTools(response);
                this.stateService.setRefreshMessage(null);
            }, error => {
                this.errorService.setToolRegisterError(error);
                this.stateService.setRefreshMessage(null);
            });
    }


    /**
     * Handles refreshing of all the workflows and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllWorkflows(userId: number) {
        this.stateService.setRefreshMessage('Refreshing all workflows...');
        this.usersService.refreshWorkflows(userId).subscribe(
            response => {
                this.workflowService.setWorkflows(response);
                this.stateService.setRefreshMessage(null);
            }, error => {
                this.errorService.setToolRegisterError(error);
                this.stateService.setRefreshMessage(null);
            });
    }

    /**
     * The list of tools is outdated.
     * Replace outdated tool with the same id with the updated tool.
     * @param {*} tool  The updated tool
     * @memberof RefreshService
     */
    replaceTool(tool: DockstoreTool) {
        this.tools = this.tools.filter(obj => obj.id !== tool.id);
        this.tools.push(tool);
        this.containerService.setTools(this.tools);
    }
}
