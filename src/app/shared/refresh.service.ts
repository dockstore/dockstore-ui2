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
import { Observable } from 'rxjs';
import { AlertService } from './alert/state/alert.service';
import { ContainerService } from './container.service';
import { GA4GHFilesService } from './ga4gh-files/ga4gh-files.service';
import { WorkflowQuery } from './state/workflow.query';
import { WorkflowService } from './state/workflow.service';
import { ContainersService } from './swagger/api/containers.service';
import { UsersService } from './swagger/api/users.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { BioWorkflow } from './swagger/model/bioWorkflow';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Service } from './swagger/model/service';
import { Workflow } from './swagger/model/workflow';
import { ToolQuery } from './tool/tool.query';

@Injectable()
export class RefreshService {
  public tool: DockstoreTool;
  private tools;
  private workflow: Service | BioWorkflow;
  constructor(
    private workflowsService: WorkflowsService,
    private containerService: ContainerService,
    private alertService: AlertService,
    private workflowService: WorkflowService,
    private containersService: ContainersService,
    private usersService: UsersService,
    private toolQuery: ToolQuery,
    private gA4GHFilesService: GA4GHFilesService,
    private workflowQuery: WorkflowQuery
  ) {
    this.toolQuery.tool$.subscribe(tool => (this.tool = tool));
    this.workflowQuery.workflow$.subscribe(workflow => (this.workflow = workflow));
    this.containerService.tools$.subscribe(tools => (this.tools = tools));
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
