/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ErrorService } from '../shared/error.service';
import { ContainerService } from './container.service';
import { GA4GHFilesService } from './ga4gh-files/ga4gh-files.service';
import { SessionService } from './session/session.service';
import { ContainersService } from './swagger/api/containers.service';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from './swagger/model/workflow';
import { ToolQuery } from './tool/tool.query';
import { WorkflowService } from './state/workflow.service';
import { WorkflowQuery } from './state/workflow.query';

@Injectable()
export class RefreshService {
    public tool: DockstoreTool;
    private tools;
    private workflow: Workflow;
    private workflows;
    constructor(private workflowsService: WorkflowsService, private containerService: ContainerService,
        private workflowService: WorkflowService, private containersService: ContainersService, private usersService: UsersService,
        private errorService: ErrorService, private snackBar: MatSnackBar, private toolQuery: ToolQuery,
        private sessionService: SessionService, private gA4GHFilesService: GA4GHFilesService, private workflowQuery: WorkflowQuery) {
        this.toolQuery.tool$.subscribe(tool => this.tool = tool);
        this.workflowQuery.workflow$.subscribe(workflow => this.workflow = workflow);
        this.containerService.tools$.subscribe(tools => this.tools = tools);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }

    /**
     * Handles refreshing of tool and updates the view.
     * @memberof RefreshService
     */
    refreshTool(): void {
      const message = 'Refreshing ' + this.tool.tool_path;
      this.sessionService.setRefreshMessage(message + ' ...');
      this.containersService.refresh(this.tool.id).subscribe((response: DockstoreTool) => {
          this.containerService.replaceTool(this.tools, response);
          this.containerService.setTool(response);
          this.handleSuccess(message);
      }, error => this.handleError(message, error)
      );
    }

    /**
     * This handles what happens after an API call returns successfully
     * TODO: Move function to another service
     * @param {string} message The custom success message that should be displayed
     * @memberof RefreshService
     */
    handleSuccess(message: string): void {
      this.sessionService.setRefreshMessage(null);
      this.snackBar.open(message + ' succeeded', 'Dismiss');
      this.errorService.setErrorAlert(null);
    }


    /**
     * This handles what happens after an API call returns an error
     * TODO: Move function to another service
     * @param {string} message The custom error message that should be displayed
     * @param {*} error The error object returned when refresh failed
     * @memberof RefreshService
     */
    handleError(message: string, error: any): void {
      this.errorService.setErrorAlert(error);
      this.sessionService.setRefreshMessage(null);
      this.snackBar.open(message + ' failed', 'Dismiss');
    }

    /**
     * Handles refreshing of the workflow and optionally updates the GA4GH files
     *
     * @param {string} toolID  GA4GH Tool ID
     * @param {string} versionName  GA4GH version name
     * @memberof RefreshService
     */
    refreshWorkflow(toolID?: string, versionName?: (string | null)): void {
      const message = 'Refreshing ' +  this.workflow.full_workflow_path;
      this.sessionService.setRefreshMessage(message + ' ...');
      this.workflowsService.refresh(this.workflow.id).subscribe((refreshedWorkflow: Workflow) => {
          this.workflowService.upsertWorkflowToWorkflow(refreshedWorkflow);
          this.workflowService.setWorkflow(refreshedWorkflow);
          this.handleSuccess(message);
          if (toolID && versionName) {
            this.gA4GHFilesService.updateFiles(toolID, versionName);
          }
      }, error => this.handleError(message, error));
    }

    /**
     * Handles refreshing of all the tools and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllTools(userId: number): void {
      const message = 'Refreshing all tools';
      this.sessionService.setRefreshMessage(message + '...');
      this.usersService.refresh(userId).subscribe(
          response => {
              this.containerService.setTools(response);
              this.handleSuccess(message);
          }, error => this.handleError(message, error));
    }


    /**
     * Handles refreshing of all the workflows and updates the view.
     * @param {number} userId The user id
     * @memberof RefreshService
     */
    refreshAllWorkflows(userId: number): void {
      const message = 'Refreshing all workflows';
      this.sessionService.setRefreshMessage(message + '...');
      this.usersService.refreshWorkflows(userId).subscribe(
          response => {
              this.workflowService.setWorkflows(response);
              this.handleSuccess(message);
          }, error => this.handleError(message, error));
    }

    /**
     * The list of tools is outdated.
     * Replace outdated tool with the same id with the updated tool.
     * @param {*} tool  The updated tool
     * @memberof RefreshService
     */
    replaceTool(tool: DockstoreTool): void {
      this.tools = this.tools.filter(obj => obj.id !== tool.id);
      this.tools.push(tool);
      this.containerService.setTools(this.tools);
    }
}
