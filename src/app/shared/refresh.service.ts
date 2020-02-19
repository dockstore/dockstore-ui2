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
import { MatSnackBar } from '@angular/material/snack-bar';

import { AlertService } from './alert/state/alert.service';
import { ContainerService } from './container.service';
import { GA4GHFilesService } from './ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from './state/workflow.query';
import { WorkflowService } from './state/workflow.service';
import { ContainersService } from './swagger/api/containers.service';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Workflow } from './swagger/model/workflow';
import { ToolQuery } from './tool/tool.query';
import { BioWorkflow } from './swagger/model/bioWorkflow';
import { Service } from './swagger/model/service';
import { Observable } from 'rxjs';

@Injectable()
export class RefreshService {
  public tool: DockstoreTool;
  private tools;
  private workflow: Service | BioWorkflow;
  private workflows;
  constructor(
    private workflowsService: WorkflowsService,
    private containerService: ContainerService,
    private alertService: AlertService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private usersService: UsersService,
    private snackBar: MatSnackBar,
    private toolQuery: ToolQuery,
    private gA4GHFilesService: GA4GHFilesService,
    private workflowQuery: WorkflowQuery
  ) {
    this.toolQuery.tool$.subscribe(tool => (this.tool = tool));
    this.workflowQuery.workflow$.subscribe(workflow => (this.workflow = workflow));
    this.containerService.tools$.subscribe(tools => (this.tools = tools));
    this.workflowService.workflows$.subscribe(workflows => (this.workflows = workflows));
  }

  /**
   * Handles refreshing of tool and updates the view.
   * @memberof RefreshService
   */
  refreshTool(): void {
    const message = 'Refreshing ' + this.tool.tool_path;
    this.alertService.start(message);
    this.containersService.refresh(this.tool.id).subscribe(
      (response: DockstoreTool) => {
        this.containerService.replaceTool(this.tools, response);
        this.containerService.setTool(response);
        this.alertService.detailedSuccess();
      },
      error => this.alertService.detailedError(error)
    );
  }

  /**
   * Handles refreshing of the workflow and optionally updates the GA4GH files
   *
   * @param {string} toolID  GA4GH Tool ID
   * @param {string} versionName  GA4GH version name
   * @memberof RefreshService
   */
  refreshWorkflow(toolID?: string, versionName?: string | null): void {
    const message = 'Refreshing ' + this.workflow.full_workflow_path;
    this.alertService.start(message);
    this.workflowsService.refresh(this.workflow.id).subscribe(
      (refreshedWorkflow: Workflow) => {
        this.workflowService.upsertWorkflowToWorkflow(refreshedWorkflow);
        this.workflowService.setWorkflow(refreshedWorkflow);
        this.alertService.detailedSuccess();
        if (toolID && versionName) {
          this.gA4GHFilesService.updateFiles(toolID, versionName);
        }
      },
      error => this.alertService.detailedError(error)
    );
  }

  /**
   * Handles refreshing of all the tools and updates the view.
   * @param {number} userId The user id
   * @memberof RefreshService
   */
  refreshAllTools(userId: number): void {
    const message = 'Refreshing all tools';
    this.alertService.start(message);
    this.usersService.refresh(userId).subscribe(
      response => {
        this.containerService.setTools(response);
        this.alertService.detailedSuccess();
      },
      error => this.alertService.detailedError(error)
    );
  }

  /**
   * Handles refreshing of all the workflows and updates the view.
   * @param {number} userId The user id
   * @memberof RefreshService
   */
  refreshAllWorkflows(userId: number): void {
    const message = 'Refreshing all workflows';
    this.alertService.start(message);
    this.usersService.refreshWorkflows(userId).subscribe(
      response => {
        this.workflowService.setWorkflows(response);
        this.alertService.detailedSuccess();
      },
      error => this.alertService.detailedError(error)
    );
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

  syncServices(): void {
    const message = 'Syncing services';
    this.alertService.start(message);
    this.updateWorkflows(this.usersService.syncUserWithGitHub());
  }

  syncServicesForOrganziation(organization: string): void {
    this.syncServices();
  }

  private updateWorkflows(workflows: Observable<Workflow[]>): void {
    workflows.subscribe(
      (services: Array<Workflow>) => {
        this.alertService.detailedSuccess();
        this.workflowService.setWorkflows(services);
      },
      error => this.alertService.detailedError(error)
    );
  }
}
