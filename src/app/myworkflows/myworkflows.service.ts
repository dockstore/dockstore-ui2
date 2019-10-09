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
import { MyEntriesService } from 'app/shared/myentries.service';
import { SessionQuery } from 'app/shared/session/session.query';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { DockstoreTool, UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { UserQuery } from 'app/shared/user/user.query';
import { RegisterWorkflowModalComponent } from 'app/workflow/register-workflow-modal/register-workflow-modal.component';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { MyBioWorkflowsService } from './my-bio-workflows.service';
import { MyServicesService } from './my-services.service';
import { OrgWorkflowObject } from './my-workflow/my-workflow.component';

@Injectable()
export class MyWorkflowsService extends MyEntriesService<Workflow> {
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
    protected urlResolverService: UrlResolverService
  ) {
    super(urlResolverService);
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
  }

  getMyEntries(userId: number, entryType: EntryType) {
    if (entryType === EntryType.BioWorkflow) {
      this.myBioWorkflowsService.getMyBioWorkflows(userId);
    } else {
      this.myServicesService.getMyServices(userId);
    }
  }

  /**
   * Grabs the workflow from the webservice and loads it
   * @param workflow Selected workflow
   */
  selectEntry(workflow: DockstoreTool | Workflow | null, entryType: EntryType | null): void {
    if (workflow && entryType) {
      if (entryType === EntryType.BioWorkflow) {
        this.myBioWorkflowsService.selectEntry(workflow.id, includesValidation);
      } else {
        this.myServicesService.selectEntry(workflow.id, includesValidation);
      }
    }
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

  convertWorkflowsToOrgWorkflowObject(workflows: Workflow[], selectedWorkflow: Workflow): OrgWorkflowObject[] {
    if (!workflows) {
      return [];
    }
    const orgWorkflowObjects: OrgWorkflowObject[] = [];
    workflows.forEach(workflow => {
      const existingOrgWorkflowObject = orgWorkflowObjects.find(
        orgWorkflowObject =>
          orgWorkflowObject.sourceControl === workflow.sourceControl && orgWorkflowObject.organization === workflow.organization
      );
      if (existingOrgWorkflowObject) {
        if (workflow.is_published) {
          existingOrgWorkflowObject.published.push(workflow);
        } else {
          existingOrgWorkflowObject.unpublished.push(workflow);
        }
      } else {
        const newOrgToolObject: OrgWorkflowObject = {
          sourceControl: workflow.sourceControl,
          organization: workflow.organization,
          ...this.createOrgEntriesObject(workflow)
        };
        orgWorkflowObjects.push(newOrgToolObject);
      }
    });
    this.recursiveSortOrgToolObjects(orgWorkflowObjects);
    this.setExpand(orgWorkflowObjects, selectedWorkflow);
    return orgWorkflowObjects;
  }

  protected recursiveSortOrgToolObjects(orgWorkflowObjects: OrgWorkflowObject[]) {
    this.sortEntriesOfOrgEntryObjects(orgWorkflowObjects);
    orgWorkflowObjects.sort(this.sortOrgWorkflowObjects);
  }

  protected sortOrgWorkflowObjects(orgWorkflowObjectA: OrgWorkflowObject, orgWorkflowObjectB: OrgWorkflowObject): number {
    const keyA = [orgWorkflowObjectA.sourceControl, orgWorkflowObjectA.organization].join('/').toLowerCase();
    const keyB = [orgWorkflowObjectB.sourceControl, orgWorkflowObjectB.organization].join('/').toLowerCase();
    return keyA.localeCompare(keyB);
  }

  protected setExpand(orgWorkflowObjects: OrgWorkflowObject[], selectedWorkflow: Workflow) {
    if (!selectedWorkflow) {
      return;
    }
    const foundOrgWorkflowObject = orgWorkflowObjects.find(orgWorkflowObject => {
      return (
        orgWorkflowObject.sourceControl === selectedWorkflow.sourceControl &&
        orgWorkflowObject.organization === selectedWorkflow.organization
      );
    });
    if (foundOrgWorkflowObject) {
      foundOrgWorkflowObject.expanded = true;
    }
  }

  getPath(entry: Workflow): string {
    return entry.full_workflow_path;
  }
}
