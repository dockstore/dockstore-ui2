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
        private workflowService: WorkflowService, private containersService: ContainersService, private usersService: UsersService) {
        this.containerService.tool$.subscribe(tool => this.tool = tool);
        this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
        this.containerService.tools.subscribe(tools => this.tools = tools);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
        this.stateService.refreshing.subscribe(refreshing => this.refreshing = refreshing);
    }

    /**
     * Handles refreshing of tool and updates the view.
     * @memberof RefreshService
     */
    refreshTool() {
        this.stateService.setRefreshing(true);
        this.containersService.refresh(this.tool.id).subscribe((response: DockstoreTool) => {
            this.replaceTool(response);
            this.containerService.setTool(response);
            this.stateService.setRefreshing(false);
        });
    }

    /**
     * Handles refreshing of the workflow and updates the view.
     * @memberof RefreshService
     */
    refreshWorkflow() {
        this.stateService.setRefreshing(true);
        this.WorkflowsService.refresh(this.workflow.id).subscribe((response: Workflow) => {
            this.replaceWorkflow(response);
            this.workflowService.setWorkflow(response);
            this.stateService.setRefreshing(false);
        });
    }


    /**
     * Handles refreshing of all the tools and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllTools(userId: number) {
        this.stateService.setRefreshing(true);
        this.usersService.refresh(userId).subscribe(
            response => {
                this.containerService.setTools(response);
                this.stateService.setRefreshing(false);
            }
        );
    }


    /**
     * Handles refreshing of all the workflows and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllWorkflows(userId: number) {
        this.stateService.setRefreshing(true);
        this.usersService.refreshWorkflows(userId).subscribe(
            response => {
                this.workflowService.setWorkflows(response);
                this.stateService.setRefreshing(false);
            }
        );
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

    /**
     * The list of workflows is outdated.
     * Replace outdated workflow with the same id with the updated workflow.
     * @param {*} workflow  The updated workflow
     * @memberof RefreshService
     */
    replaceWorkflow(workflow: Workflow) {
        this.workflows = this.workflows.filter(obj => obj.id !== workflow.id);
        this.workflows.push(workflow);
        this.workflowService.setWorkflows(this.workflows);
    }
}
