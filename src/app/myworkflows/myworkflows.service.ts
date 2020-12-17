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

import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { transaction } from '@datorama/akita';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { includesValidation } from 'app/shared/constants';
import { EntryType } from 'app/shared/enum/entry-type';
import { MyEntriesService } from 'app/shared/myentries.service';
import { SessionQuery } from 'app/shared/session/session.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { BioWorkflow, DockstoreTool, SharedWorkflows, UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UrlResolverService } from 'app/shared/url-resolver.service';
import { UserQuery } from 'app/shared/user/user.query';
import { RegisterWorkflowModalComponent } from 'app/workflow/register-workflow-modal/register-workflow-modal.component';
import { forkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { MyBioWorkflowsService } from './my-bio-workflows.service';
import { MyServicesService } from './my-services.service';
import { OrgWorkflowObject } from './my-workflow/my-workflow.component';

@Injectable()
export class MyWorkflowsService extends MyEntriesService<Workflow, OrgWorkflowObject<Workflow>> {
  gitHubAppInstallationLink$: Observable<string>;
  constructor(
    protected userQuery: UserQuery,
    protected alertService: AlertService,
    protected usersService: UsersService,
    protected workflowService: WorkflowService,
    protected workflowsService: WorkflowsService,
    private myBioWorkflowsService: MyBioWorkflowsService,
    private myServicesService: MyServicesService,
    private myEntriesStateService: MyEntriesStateService,
    private sessionQuery: SessionQuery,
    public matDialog: MatDialog,
    protected urlResolverService: UrlResolverService
  ) {
    super(urlResolverService);
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
  }

  getMyEntries(userId: number, entryType: EntryType) {
    if (entryType === EntryType.BioWorkflow) {
      this.getMyBioWorkflows(userId);
    } else {
      this.getMyServices(userId);
    }
  }

  getMyServices(id: number): void {
    this.alertService.start('Fetching services');
    this.myEntriesStateService.setRefreshingMyEntries(true);
    this.usersService
      .userServices(id)
      .pipe(
        finalize(() => {
          this.myEntriesStateService.setRefreshingMyEntries(false);
        })
      )
      .subscribe(
        (services: Array<Workflow>) => {
          this.workflowService.setWorkflows(services);
          this.workflowService.setSharedWorkflows([]);
          this.alertService.simpleSuccess();
          this.selectEntry(this.recomputeWhatEntryToSelect([...(services || []), ...[]]), EntryType.Service);
        },
        (error) => {
          this.workflowService.setWorkflows([]);
          this.workflowService.setSharedWorkflows([]);
          this.alertService.detailedSnackBarError(error);
        }
      );
  }

  /**
   * Very strange function that gets both the user's workflows and the user's shared workflows
   * If one of them errors, the other should still continue executing.  This is done by catching it.
   * Once both of them finish, the error is determined whether the type is Array (which is normal) or not (which means HttpErrorResponse
   * If both errors, then only the user's workflows error message is displayed
   *
   * @param {number} id  The user ID
   * @memberof MyBioWorkflowsService
   */
  getMyBioWorkflows(id: number): void {
    this.alertService.start('Fetching workflows');
    this.myEntriesStateService.setRefreshingMyEntries(true);
    forkJoin([
      this.usersService.userWorkflows(id).pipe(
        catchError((error: HttpErrorResponse) => {
          return observableOf(error);
        })
      ),
      this.workflowsService.sharedWorkflows().pipe(
        catchError((error: HttpErrorResponse) => {
          return observableOf(error);
        })
      ),
    ])
      .pipe(
        finalize(() => {
          this.alertService.simpleSuccess();
          this.myEntriesStateService.setRefreshingMyEntries(false);
        })
      )
      .subscribe(
        ([workflows, sharedWorkflows]: [Array<BioWorkflow> | HttpErrorResponse, Array<SharedWorkflows> | HttpErrorResponse]) => {
          if (!Array.isArray(workflows) && !Array.isArray(sharedWorkflows)) {
            this.alertService.detailedSnackBarError(workflows);
            workflows = [];
            sharedWorkflows = [];
          } else {
            if (!Array.isArray(workflows)) {
              this.alertService.detailedSnackBarError(workflows);
              workflows = [];
            }
            if (!Array.isArray(sharedWorkflows)) {
              this.alertService.detailedSnackBarError(sharedWorkflows);
              sharedWorkflows = [];
            }
          }
          this.workflowService.setWorkflows(workflows);
          this.workflowService.setSharedWorkflows(sharedWorkflows);
          const actualSharedWorkflows = WorkflowService.convertSharedWorkflowsToWorkflowsList(sharedWorkflows);
          this.selectEntry(
            this.recomputeWhatEntryToSelect([...(workflows || []), ...(actualSharedWorkflows || [])]),
            EntryType.BioWorkflow
          );
        },
        (error) => {
          console.error('This should be impossible because both errors are caught already');
        }
      );
  }

  /**
   * Grabs the workflow from the webservice and loads it
   * @param workflow Selected workflow
   */
  selectEntry(workflow: DockstoreTool | Workflow | null, entryType: EntryType | null): void {
    if (workflow && entryType && workflow.id) {
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
      const dialogRef = this.matDialog.open(RegisterWorkflowModalComponent, { width: '600px' });
      dialogRef.afterClosed().subscribe((reloadEntries) => {
        if (reloadEntries) {
          const user = this.userQuery.getValue().user;
          if (user) {
            this.getMyEntries(user.id, entryType);
          }
        }
      });
    }
    if (entryType === EntryType.Service) {
      this.gitHubAppInstallationLink$.pipe(take(1)).subscribe((link) => window.open(link));
    }
  }

  createNewOrgEntryObject(workflow: Workflow): OrgWorkflowObject<Workflow> {
    return {
      sourceControl: workflow.sourceControl,
      organization: workflow.organization,
      ...this.createPartial(workflow),
    };
  }

  protected sortOrgEntryObjects(orgWorkflowObjectA: OrgWorkflowObject<Workflow>, orgWorkflowObjectB: OrgWorkflowObject<Workflow>): number {
    const keyA = [orgWorkflowObjectA.sourceControl, orgWorkflowObjectA.organization].join('/').toLowerCase();
    const keyB = [orgWorkflowObjectB.sourceControl, orgWorkflowObjectB.organization].join('/').toLowerCase();
    return keyA.localeCompare(keyB);
  }

  matchingOrgEntryObject(
    orgWorkflowObjects: OrgWorkflowObject<Workflow>[],
    selectedWorkflow: Workflow
  ): OrgWorkflowObject<Workflow> | undefined {
    return orgWorkflowObjects.find((orgWorkflowObject) => {
      return (
        orgWorkflowObject.sourceControl === selectedWorkflow.sourceControl &&
        orgWorkflowObject.organization === selectedWorkflow.organization
      );
    });
  }

  getPath(entry: Workflow): string {
    return entry.full_workflow_path || '';
  }

  sortEntry(entryA: Workflow, entryB: Workflow): number {
    const sourceControlA = entryA.sourceControl.toLowerCase();
    const sourceControlB = entryB.sourceControl.toLowerCase();
    const compareSourceControl = sourceControlA.localeCompare(sourceControlB);
    if (compareSourceControl) {
      return compareSourceControl;
    }
    const organizationA = entryA.organization.toLowerCase();
    const organizationB = entryB.organization.toLowerCase();
    const compareOrganization = organizationA.localeCompare(organizationB);
    if (compareOrganization) {
      return compareOrganization;
    }
    const keyA = (entryA.full_workflow_path || '').toLowerCase();
    const keyB = (entryB.full_workflow_path || '').toLowerCase();
    return keyA.localeCompare(keyB);
  }
}
