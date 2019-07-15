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
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd, Router } from '@angular/router/';
import { EntryType } from 'app/shared/enum/entry-type';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { TokenService } from 'app/shared/state/token.service';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Service } from 'app/shared/swagger/model/service';
import { AuthService } from 'ng2-ui-auth';
import { combineLatest, Observable } from 'rxjs';
import { filter, shareReplay, takeUntil } from 'rxjs/operators';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { myBioWorkflowsURLSegment, myServicesURLSegment } from '../../shared/constants';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedWorkflow } from '../../shared/models/ExtendedWorkflow';
import { MyEntry } from '../../shared/my-entry';
import { ProviderService } from '../../shared/provider.service';
import { RefreshService } from '../../shared/refresh.service';
import { TokenQuery } from '../../shared/state/token.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { Workflow } from '../../shared/swagger';
import { Configuration } from '../../shared/swagger/configuration';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
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
  providers: [ProviderService, DockstoreService]
})
export class MyWorkflowComponent extends MyEntry implements OnInit {
  workflow: Service | BioWorkflow;
  workflows: Array<Workflow>;
  entryType: EntryType;
  entryType$: Observable<EntryType>;
  myEntryPageTitle$: Observable<string>;
  workflow$: Observable<Service | BioWorkflow>;
  EntryType = EntryType;
  sharedWorkflows: Array<Workflow>;
  readonly pageName = '/my-workflows';
  public isRefreshing$: Observable<boolean>;
  public showSidebar = true;
  hasSourceControlToken$: Observable<boolean>;
  public gitHubAppInstallationLink$: Observable<string>;
  constructor(
    protected configuration: Configuration,
    protected activatedRoute: ActivatedRoute,
    private userQuery: UserQuery,
    private workflowService: WorkflowService,
    protected authService: AuthService,
    public dialog: MatDialog,
    protected accountsService: AccountsService,
    private refreshService: RefreshService,
    private router: Router,
    private registerWorkflowModalService: RegisterWorkflowModalService,
    protected urlResolverService: UrlResolverService,
    protected tokenQuery: TokenQuery,
    protected workflowQuery: WorkflowQuery,
    private alertQuery: AlertQuery,
    private tokenService: TokenService,
    protected sessionService: SessionService,
    protected sessionQuery: SessionQuery,
    private myWorkflowsService: MyWorkflowsService
  ) {
    super(accountsService, authService, configuration, tokenQuery, urlResolverService, sessionQuery, sessionService, activatedRoute);
    this.entryType = this.sessionQuery.getSnapshot().entryType;
    this.entryType$ = this.sessionQuery.entryType$.pipe(shareReplay(1));
  }

  ngOnInit() {
    this.myWorkflowsService.clearPartialState();
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
    this.tokenQuery.gitHubToken$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((token: string) => this.tokenService.getGitHubOrganizations(token));
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => (this.user = user));
    this.isRefreshing$ = this.alertQuery.showInfo$;
    /**
     * This handles selecting of a workflow based on changing URL. It also handles when the router changes url
     * due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons.
     */
    this.workflow$ = this.workflowQuery.selectActive();
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(event => {
        if (this.groupEntriesObject && this.groupSharedEntriesObject) {
          const foundWorkflow = this.findEntryFromPath(
            this.urlResolverService.getEntryPathFromUrl(),
            this.groupEntriesObject.concat(this.groupSharedEntriesObject)
          );
          this.selectEntry(foundWorkflow);
        }
      });
    this.hasSourceControlToken$ = this.tokenQuery.hasSourceControlToken$;
    this.commonMyEntriesOnInit();

    // Updates selected workflow from service and selects in sidebar
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => (this.workflow = workflow));
    this.getMyEntries();

    // Using the workflows and shared with me workflows, initialize the organization groupings and set the initial entry
    combineLatest(this.workflowService.workflows$, this.workflowService.sharedWorkflows$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        ([workflows, sharedWorkflows]) => {
          if (workflows && sharedWorkflows) {
            this.workflows = workflows;
            const sortedWorkflows = this.myWorkflowsService.sortGroupEntries(workflows, this.user.username, EntryType.BioWorkflow);
            this.setGroupEntriesObject(sortedWorkflows);

            this.sharedWorkflows = sharedWorkflows;
            const sortedSharedWorkflows = this.myWorkflowsService.sortGroupEntries(
              sharedWorkflows,
              this.user.username,
              EntryType.BioWorkflow
            );
            this.setGroupSharedEntriesObject(sortedSharedWorkflows);

            // If a user navigates directly to an unpublished workflow on their my-workflows page (via bookmark, refresh),
            // the url needs to be used to set the workflow onInit.
            // Otherwise, the select - tab.pipe results in really strange behaviour. Not entirely sure why.
            this.workflowService.setWorkflow(
              this.findEntryFromPath(
                this.urlResolverService.getEntryPathFromUrl(),
                this.groupEntriesObject.concat(this.groupSharedEntriesObject)
              )
            );
            // Only select initial entry if there current is no selected entry.  Otherwise, leave as is.
            if (!this.workflow) {
              if (this.workflows.length > 0) {
                this.selectInitialEntry(sortedWorkflows);
              } else if (this.sharedWorkflows.length > 0) {
                this.selectInitialEntry(sortedSharedWorkflows);
              }
            }
          }
        },
        error => {
          console.error('Something has gone horribly wrong with sharedWorkflows$ and/or workflows$');
        }
      );
  }

  private getMyEntries() {
    combineLatest(this.userQuery.user$, this.sessionQuery.entryType$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, entryType]) => {
        if (user && entryType) {
          this.myWorkflowsService.getMyEntries(user.id, entryType);
        }
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
    return this.myWorkflowsService.convertOldNamespaceObjectToOrgEntriesObject(nsWorkflows);
  }

  protected getFirstPublishedEntry(orgWorkflows: Array<OrgWorkflowObject>): Workflow | null {
    return this.myWorkflowsService.getFirstPublishedEntry(orgWorkflows);
  }

  protected findEntryFromPath(path: string, orgWorkflows: Array<OrgWorkflowObject>): ExtendedWorkflow | null {
    return this.myWorkflowsService.findEntryFromPath(path, orgWorkflows);
  }

  /**
   * Grabs the workflow from the webservice and loads it
   * @param workflow Selected workflow
   */
  selectEntry(workflow: ExtendedWorkflow | null): void {
    this.myWorkflowsService.selectEntry(workflow, this.entryType);
  }

  /**
   * Triggers a URL change, which will select the appropriate workflow
   * @param workflow Selected workflow
   */
  goToEntry(workflow: ExtendedWorkflow | null): void {
    if (workflow !== null) {
      if (this.entryType === EntryType.BioWorkflow) {
        this.router.navigateByUrl('/' + myBioWorkflowsURLSegment + '/' + workflow.full_workflow_path);
      } else {
        this.router.navigateByUrl('/' + myServicesURLSegment + '/' + workflow.full_workflow_path);
      }
    }
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    this.myWorkflowsService.registerEntry();
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
