/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router/';
import { AuthService } from 'ng2-ui-auth';
import { combineLatest, forkJoin, Observable, of as observableOf } from 'rxjs';
import { catchError, filter, finalize, takeUntil } from 'rxjs/operators';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { includesValidation } from '../../shared/constants';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { MyEntry } from '../../shared/my-entry';
import { ProviderService } from '../../shared/provider.service';
import { RefreshService } from '../../shared/refresh.service';
import { TokenQuery } from '../../shared/state/token.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { Workflow } from '../../shared/swagger';
import { UsersService } from '../../shared/swagger/api/users.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Configuration } from '../../shared/swagger/configuration';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
import { RegisterWorkflowModalComponent } from '../../workflow/register-workflow-modal/register-workflow-modal.component';
import { RegisterWorkflowModalService } from '../../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyWorkflowsService } from '../myworkflows.service';

/**
 * How the workflow selection works:
 * Each action is fully completed if 3 things are updated (URL, workflow$ and workflows$)
 * workflows$ is completely seperate from URL and workflow$ (none of them should update the other)
 * URL change is tied to workflow$ change
 *
 * To update (refresh, publish, etc) a currently selected workflow, update workflows$ first then
 * update workflow$ (URL is presumed to already be correct)
 *
 * Register a new workflow which is not currently selected because it doesn't exist yet involves updating workflows$ and then
 * going to the new URL (this should exist now) which triggers a workflow$ change
 * @export
 * @class MyWorkflowComponent
 * @extends {MyEntry}
 * @implements {OnInit}
 */
@Component({
  selector: 'app-my-workflow',
  templateUrl: './my-workflow.component.html',
  styleUrls: ['../../shared/styles/my-entry.component.scss'],
  providers: [MyWorkflowsService, ProviderService,
    DockstoreService]
})

export class MyWorkflowComponent extends MyEntry implements OnInit {
  workflow: Workflow;
  workflows: Array<Workflow>;
  sharedWorkflows: Array<Workflow>;
  readonly pageName = '/my-workflows';
  public isRefreshing$: Observable<boolean>;
  public showSidebar = true;
  hasSourceControlToken$: Observable<boolean>;
  constructor(private myworkflowService: MyWorkflowsService, protected configuration: Configuration,
    private usersService: UsersService, private userQuery: UserQuery, private alertService: AlertService,
    private workflowService: WorkflowService, protected authService: AuthService, public dialog: MatDialog,
    protected accountsService: AccountsService, private refreshService: RefreshService,
    private router: Router, private location: Location, private registerWorkflowModalService: RegisterWorkflowModalService,
    protected urlResolverService: UrlResolverService, private workflowsService: WorkflowsService, private matSnackbar: MatSnackBar,
    protected tokenQuery: TokenQuery, protected workflowQuery: WorkflowQuery, private alertQuery: AlertQuery) {
    super(accountsService, authService, configuration, tokenQuery, urlResolverService);
  }

  ngOnInit() {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    /**
     * This handles selecting of a workflow based on changing URL. It also handles when the router changes url
     * due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons.
     */
    this.router.events.pipe(filter(event => event instanceof NavigationEnd), takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (this.groupEntriesObject && this.groupSharedEntriesObject) {
        const foundWorkflow = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(),
          this.groupEntriesObject.concat(this.groupSharedEntriesObject));
        this.selectEntry(foundWorkflow);
      }
    });
    this.hasSourceControlToken$ = this.tokenQuery.hasSourceControlToken$;
    this.commonMyEntriesOnInit();
    this.workflowService.setWorkflow(null);
    this.workflowService.setWorkflows(null);
    this.workflowService.setSharedWorkflows(null);

    // Updates selected workflow from service and selects in sidebar
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => this.workflow = workflow);

    // Retrieve all of the workflows for the user and update the workflow service
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      if (user) {
        this.user = user;
        this.alertService.start('Fetching workflows');
        forkJoin(this.usersService.userWorkflows(user.id).pipe(catchError(error => {
          this.alertService.detailedError(error);
          return observableOf([]);
        })), this.workflowsService.sharedWorkflows().pipe(catchError(error => {
          this.alertService.detailedError(error);
          return observableOf([]);
        }))).pipe(finalize(() => this.alertService.detailedSuccess()),
          takeUntil(this.ngUnsubscribe)).subscribe(([workflows, sharedWorkflows]) => {
            this.workflowService.setWorkflows(workflows);
            this.workflowService.setSharedWorkflows(sharedWorkflows);
          }, error => {
            console.error('This should be impossible because both errors are caught already');
          });
      }
    });

    // Using the workflows and shared with me workflows, initialize the organization groupings and set the initial entry
    combineLatest(this.workflowService.workflows$, this.workflowService.sharedWorkflows$)
      .pipe(takeUntil(this.ngUnsubscribe)).subscribe(([workflows, sharedWorkflows]) => {
        if (workflows && sharedWorkflows) {
          this.workflows = workflows;
          const sortedWorkflows = this.myworkflowService.sortGroupEntries(workflows, this.user.username, 'workflow');
          this.setGroupEntriesObject(sortedWorkflows);

          this.sharedWorkflows = sharedWorkflows;
          const sortedSharedWorkflows = this.myworkflowService.sortGroupEntries(sharedWorkflows, this.user.username, 'workflow');
          this.setGroupSharedEntriesObject(sortedSharedWorkflows);

          // Only select initial entry if there current is no selected entry.  Otherwise, leave as is.
          if (!this.workflow) {
            if (this.workflows.length > 0) {
              this.selectInitialEntry(sortedWorkflows);
            } else if (this.sharedWorkflows.length > 0) {
              this.selectInitialEntry(sortedSharedWorkflows);
            }
          }
        }
      }, error => {
        console.error('Something has gone horribly wrong with sharedWorkflows$ and/or workflows$');
      });
  }

  /**
   * Sets the sorted entries for display in dropdowns
   * @param sortedEntries Array of sorted entries
   */
  public setGroupSharedEntriesObject(sortedEntries: any): void {
    this.groupSharedEntriesObject = this.convertOldNamespaceObjectToOrgEntriesObject(sortedEntries);
  }

  /**
   * Toggles the sidebar
   */
  public toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  protected convertOldNamespaceObjectToOrgEntriesObject(nsWorkflows: Array<any>): Array<OrgWorkflowObject> {
    const groupEntriesObject: Array<OrgWorkflowObject> = [];
    for (let i = 0; i < nsWorkflows.length; i++) {
      const orgWorkflowObject: OrgWorkflowObject = {
        sourceControl: '',
        organization: '',
        published: [],
        unpublished: []
      };
      const nsWorkflow: Array<Workflow> = nsWorkflows[i].entries;
      orgWorkflowObject.sourceControl = nsWorkflows[i].sourceControl;
      orgWorkflowObject.organization = nsWorkflows[i].organization;
      orgWorkflowObject.published = nsWorkflow.filter((workflow: Workflow) => {
        return workflow.is_published;
      });
      orgWorkflowObject.unpublished = nsWorkflow.filter((workflow: Workflow) => {
        return !workflow.is_published;
      });
      groupEntriesObject.push(orgWorkflowObject);
    }
    return groupEntriesObject;
  }

  protected getFirstPublishedEntry(orgWorkflows: Array<OrgWorkflowObject>): Workflow {
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

  protected findEntryFromPath(path: string, orgWorkflows: Array<OrgWorkflowObject>): ExtendedWorkflow {
    let matchingWorkflow: ExtendedWorkflow;
    for (let i = 0; i < orgWorkflows.length; i++) {
      matchingWorkflow = orgWorkflows[i].published.find((workflow: Workflow) => workflow.full_workflow_path === path);
      if (matchingWorkflow) {
        return matchingWorkflow;
      }
      matchingWorkflow = orgWorkflows[i].unpublished.find((workflow: Workflow) => workflow.full_workflow_path === path);
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
  selectEntry(workflow: ExtendedWorkflow): void {
    if (workflow !== null) {
      this.workflowsService.getWorkflow(workflow.id, includesValidation).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
        this.location.go('/my-workflows/' + result.full_workflow_path);
        this.workflowService.setWorkflow(result);
      });
    }
  }

  /**
   * Triggers a URL change, which will select the appropriate workflow
   * @param workflow Selected workflow
   */
  goToEntry(workflow: ExtendedWorkflow): void {
    if (workflow !== null) {
      this.router.navigateByUrl('/my-workflows/' + workflow.full_workflow_path);
    }
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    const dialogRef = this.dialog.open(RegisterWorkflowModalComponent, { width: '600px' });
  }

  refreshAllEntries(): void {
    this.refreshService.refreshAllWorkflows(this.user.id);
  }

}
export interface OrgWorkflowObject {
  sourceControl: string;
  organization: string;
  published: Array<Workflow>;
  unpublished: Array<Workflow>;
}
