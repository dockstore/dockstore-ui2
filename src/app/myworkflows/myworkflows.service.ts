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
import { MatDialog } from '@angular/material/dialog';
import { transaction } from '@datorama/akita';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { includesValidation } from 'app/shared/constants';
import { EntryType } from 'app/shared/enum/entry-type';
import { ExtendedWorkflow } from 'app/shared/models/ExtendedWorkflow';
import { MyEntriesService } from 'app/shared/myentries.service';
import { SessionQuery } from 'app/shared/session/session.query';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { UserQuery } from 'app/shared/user/user.query';
import { RegisterWorkflowModalComponent } from 'app/workflow/register-workflow-modal/register-workflow-modal.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MyBioWorkflowsService } from './my-bio-workflows.service';
import { MyServicesService } from './my-services.service';
import { OrgWorkflowObject } from './my-workflow/my-workflow.component';

@Injectable()
export class MyWorkflowsService extends MyEntriesService {
  gitHubAppInstallationLink$: Observable<string>;
  constructor(
    protected userQuery: UserQuery,
    protected alertService: AlertService,
    protected usersService: UsersService,
    protected workflowService: WorkflowService,
    protected workflowsService: WorkflowsService,
    private myBioWorkflowsService: MyBioWorkflowsService,
    private myServicesService: MyServicesService,
    private sessionQuery: SessionQuery,
    public matDialog: MatDialog,
    public urlResolverService: UrlResolverService
  ) {
    super();
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
  }

  getMyEntries(userId: number, entryType: EntryType) {
    if (entryType === EntryType.BioWorkflow) {
      this.myBioWorkflowsService.getMyBioWorkflows(userId);
    } else {
      this.myServicesService.getMyServices(userId);
    }
  }

  getGroupIndex(groupEntries: any[], group: string): number {
    return groupEntries.findIndex(orgWorkflow => orgWorkflow.sourceControl + '/' + orgWorkflow.organization === group);
  }

  public findEntryFromPath(path: string, orgWorkflows: Array<OrgWorkflowObject>): ExtendedWorkflow | null {
    let matchingWorkflow: ExtendedWorkflow;
    for (let i = 0; i < orgWorkflows.length; i++) {
      matchingWorkflow = orgWorkflows[i].published.find((workflow: ExtendedWorkflow) => workflow.full_workflow_path === path);
      if (matchingWorkflow) {
        return matchingWorkflow;
      }
      matchingWorkflow = orgWorkflows[i].unpublished.find((workflow: ExtendedWorkflow) => workflow.full_workflow_path === path);
      if (matchingWorkflow) {
        return matchingWorkflow;
      }
    }
    return null;
  }

  /**
   * Grabs the workflow from the webservice and loads it
   * @param workflow Selected workflow
   */
  selectEntry(workflow: ExtendedWorkflow | null, entryType: EntryType | null): void {
    if (workflow && entryType) {
      if (entryType === EntryType.BioWorkflow) {
        this.myBioWorkflowsService.selectEntry(workflow.id, includesValidation);
      } else {
        this.myServicesService.selectEntry(workflow.id, includesValidation);
      }
    }
  }

  public getFirstPublishedEntry(orgWorkflows: Array<OrgWorkflowObject>): Workflow | null {
    for (let i = 0; i < orgWorkflows.length; i++) {
      const foundWorkflow = orgWorkflows[i]['entries'].find((workflow: Workflow) => {
        return workflow.is_published === true;
      });
      if (foundWorkflow) {
        return foundWorkflow;
      }
    }
    return null;
  }

  public convertOldNamespaceObjectToOrgEntriesObject(nsWorkflows: Array<any>): Array<OrgWorkflowObject> {
    const groupEntriesObject: Array<OrgWorkflowObject> = [];
    nsWorkflows.map(nsWorkflow => {
      const orgWorkflowObject: OrgWorkflowObject = {
        sourceControl: '',
        organization: '',
        published: [],
        unpublished: [],
        expanded: false
      };
      const nsWorkflowEntries: Array<Workflow> = nsWorkflow.entries;
      orgWorkflowObject.sourceControl = nsWorkflow.sourceControl;
      orgWorkflowObject.organization = nsWorkflow.organization;
      orgWorkflowObject.published = nsWorkflowEntries.filter((workflow: Workflow) => workflow.is_published);
      orgWorkflowObject.unpublished = nsWorkflowEntries.filter((workflow: Workflow) => !workflow.is_published);
      groupEntriesObject.push(orgWorkflowObject);
    });
    return groupEntriesObject;
  }

  @transaction()
  clearPartialState(): void {
    this.workflowService.clearActive();
    this.workflowService.clearVersion();
    this.workflowService.setWorkflow(null);
    this.workflowService.setWorkflows(null);
    this.workflowService.setSharedWorkflows(null);
  }

  // Given enum name, returns the friendly name
  // TODO: This should be connected to the existing enum in the workflow model, however that does
  // not have the friendly names
  getSourceControlFriendlyName(sourceControlEnum: string): string {
    if (sourceControlEnum === 'GITHUB') {
      return 'github.com';
    } else if (sourceControlEnum === 'GITLAB') {
      return 'gitlab.com';
    } else if (sourceControlEnum === 'BITBUCKET') {
      return 'bitbucket.org';
    }
    return null;
  }

  registerEntry(entryType: EntryType | null) {
    if (entryType === EntryType.BioWorkflow) {
      this.matDialog.open(RegisterWorkflowModalComponent, { width: '600px' });
    }
    if (entryType === EntryType.Service) {
      this.gitHubAppInstallationLink$.pipe(take(1)).subscribe(link => window.open(link));
    }
  }

  recomputeWhatToolToSelect(tools: Workflow[]): Workflow | null {
    const foundTool = this.findWorkflowFromPath(this.urlResolverService.getEntryPathFromUrl(), tools);
    if (foundTool) {
      return foundTool;
    } else {
      const initialEntry = this.getInitialEntry(tools);
      if (initialEntry) {
        return initialEntry;
      } else {
        return null;
      }
    }
  }

  convertToolsToOrgToolObject(tools: Workflow[], selectedTool: Workflow): OrgWorkflowObject[] {
    if (!tools) {
      return [];
    }
    const orgToolObjects: OrgWorkflowObject[] = [];
    tools.forEach(tool => {
      const existingOrgToolObject = orgToolObjects.find(
        orgToolObject => orgToolObject.sourceControl === tool.sourceControl && orgToolObject.organization === tool.organization
      );
      if (existingOrgToolObject) {
        if (tool.is_published) {
          existingOrgToolObject.published.push(tool);
        } else {
          existingOrgToolObject.unpublished.push(tool);
        }
      } else {
        const newOrgToolObject: OrgWorkflowObject = {
          sourceControl: tool.sourceControl,
          organization: tool.organization,
          published: tool.is_published ? [tool] : [],
          unpublished: tool.is_published ? [] : [tool],
          expanded: false
        };
        orgToolObjects.push(newOrgToolObject);
      }
    });
    this.recursiveSortOrgToolObjects(orgToolObjects);
    this.setExpand(orgToolObjects, selectedTool);
    return orgToolObjects;
  }

  protected recursiveSortOrgToolObjects(orgToolObjects: OrgWorkflowObject[]) {
    orgToolObjects.forEach(orgToolObject => {
      orgToolObject.published.sort(this.sortWorkflows);
    });
    orgToolObjects.sort(this.sortOrgToolObjects);
  }

  protected sortWorkflows(toolA: Workflow, toolB: Workflow): number {
    const keyA = toolA.full_workflow_path.toLowerCase();
    const keyB = toolB.full_workflow_path.toLowerCase();
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  }

  protected sortOrgToolObjects(orgToolObjectA: OrgWorkflowObject, orgToolObjectB: OrgWorkflowObject): number {
    const keyA = [orgToolObjectA.sourceControl, orgToolObjectA.organization].join('/').toLowerCase();
    const keyB = [orgToolObjectB.sourceControl, orgToolObjectB.organization].join('/').toLowerCase();
    if (keyA < keyB) {
      return -1;
    }
    if (keyA > keyB) {
      return 1;
    }
    return 0;
  }

  protected setExpand(orgWorkflowObjects: OrgWorkflowObject[], selectedWorkflow: Workflow) {
    if (!selectedWorkflow) {
      return;
    }
    const foundOrgWorkflowObject = orgWorkflowObjects.find(orgToolObject => {
      return orgToolObject.sourceControl === selectedWorkflow.sourceControl && orgToolObject.organization === selectedWorkflow.organization;
    });
    if (foundOrgWorkflowObject) {
      foundOrgWorkflowObject.expanded = true;
    }
  }

  /**
   * Precondition: URL does not yield any useful tool
   * Select the first published tool. If there's no published, select the first unpublished tool.
   * @param workflows
   */
  protected getInitialEntry(workflows: Workflow[] | null): Workflow | null {
    if (!workflows || workflows.length === 0) {
      return null;
    }
    const publishedWorkflows = workflows.filter(workflow => workflow.is_published);
    if (publishedWorkflows.length > 0) {
      publishedWorkflows.sort(this.sortWorkflows);
      return publishedWorkflows[0];
    } else {
      const unpublishedWorkflows = workflows.filter(workflow => !workflow.is_published);
      if (unpublishedWorkflows.length > 0) {
        unpublishedWorkflows.sort(this.sortWorkflows);
        return unpublishedWorkflows[0];
      } else {
        return null;
      }
    }
  }

  private findWorkflowFromPath(path: string | null, workflows: Workflow[] | null): Workflow | null {
    if (!path || !workflows || workflows.length === 0) {
      return null;
    }
    return workflows.find(workflow => {
      return workflow.full_workflow_path === path;
    });
  }
}
