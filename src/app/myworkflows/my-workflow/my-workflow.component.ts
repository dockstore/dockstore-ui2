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
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { EntryType } from 'app/shared/enum/entry-type';
import { User } from 'app/shared/openapi';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { TokenService } from 'app/shared/state/token.service';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Service } from 'app/shared/swagger/model/service';
import { UserService } from 'app/shared/user/user.service';
import { AuthService } from 'ng2-ui-auth';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, shareReplay, takeUntil } from 'rxjs/operators';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { MyEntry, OrgEntryObject } from '../../shared/my-entry';
import { TokenQuery } from '../../shared/state/token.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { DockstoreTool, Workflow } from '../../shared/swagger';
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
})
export class MyWorkflowComponent extends MyEntry implements OnInit {
  faGithub = faGithub;
  workflow: Service | BioWorkflow;
  workflows: Array<Workflow>;
  entryType: EntryType;
  entryType$: Observable<EntryType>;
  user: User;
  user$: Observable<User>;
  myEntryPageTitle$: Observable<string>;
  workflow$: Observable<Service | BioWorkflow>;
  EntryType = EntryType;
  sharedWorkflows: Array<Workflow>;
  noUser$: Observable<boolean>;
  readonly pageName = '/my-workflows';
  public isRefreshing$: Observable<boolean>;
  public showSidebar = true;
  hasSourceControlToken$: Observable<boolean>;
  public gitHubAppInstallationLink$: Observable<string>;
  public groupEntriesObject$: Observable<Array<OrgWorkflowObject<Workflow>>>;
  public groupSharedEntriesObject$: Observable<Array<OrgWorkflowObject<Workflow>>>;
  public hasGroupSharedEntriesObject$: Observable<boolean>;
  constructor(
    protected configuration: Configuration,
    protected activatedRoute: ActivatedRoute,
    protected userQuery: UserQuery,
    private workflowService: WorkflowService,
    protected authService: AuthService,
    public dialog: MatDialog,
    protected accountsService: AccountsService,
    private userService: UserService,
    private router: Router,
    private registerWorkflowModalService: RegisterWorkflowModalService,
    protected urlResolverService: UrlResolverService,
    protected tokenQuery: TokenQuery,
    protected workflowQuery: WorkflowQuery,
    private alertQuery: AlertQuery,
    private tokenService: TokenService,
    protected sessionService: SessionService,
    protected sessionQuery: SessionQuery,
    private myWorkflowsService: MyWorkflowsService,
    protected myEntriesQuery: MyEntriesQuery,
    protected myEntriesStateService: MyEntriesStateService
  ) {
    super(
      accountsService,
      authService,
      configuration,
      tokenQuery,
      urlResolverService,
      sessionQuery,
      sessionService,
      activatedRoute,
      myEntriesQuery,
      userQuery,
      myEntriesStateService
    );
    this.entryType = this.sessionQuery.getValue().entryType;
    this.entryType$ = this.sessionQuery.entryType$.pipe(shareReplay(1));
    this.user = this.userQuery.getValue().user;
    this.user$ = this.userQuery.user$;
    this.noUser$ = this.userQuery.noUser$;
  }

  ngOnInit() {
    this.myWorkflowsService.clearPartialState();
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLink$;
    this.tokenService.getGitHubOrganizations();
    this.isRefreshing$ = this.alertQuery.showInfo$;
    /**
     * This handles selecting of a workflow based on changing URL. It also handles when the router changes url
     * due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons.
     */
    this.workflow$ = this.workflowQuery.selectActive();
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.selectEntry(this.myWorkflowsService.recomputeWhatEntryToSelect([...(this.workflows || []), ...(this.sharedWorkflows || [])]));
      });
    this.hasSourceControlToken$ = this.tokenQuery.hasSourceControlToken$;
    this.commonMyEntriesOnInit();

    // Updates selected workflow from service and selects in sidebar
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow) => (this.workflow = workflow));
    this.getMyEntries();

    // Using the workflows and shared with me workflows, initialize the organization groupings and set the initial entry
    combineLatest([this.workflowService.workflows$, this.workflowService.sharedWorkflows$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        ([workflows, sharedWorkflows]: [Workflow[], Workflow[]]) => {
          if (workflows && sharedWorkflows) {
            this.workflows = workflows;
            this.sharedWorkflows = sharedWorkflows;
          }
        },
        () => {
          console.error('Something has gone horribly wrong with sharedWorkflows$ and/or workflows$');
        }
      );
    this.groupEntriesObject$ = combineLatest([
      this.workflowService.workflows$,
      this.workflowQuery.selectActive(),
      this.tokenQuery.gitHubOrganizations$,
    ]).pipe(
      map(([workflows, workflow, gitHubOrganizations]) => {
        return this.myWorkflowsService.convertEntriesToOrgEntryObject(workflows, workflow, gitHubOrganizations);
      })
    );

    this.groupSharedEntriesObject$ = combineLatest([this.workflowService.sharedWorkflows$, this.workflowQuery.selectActive()]).pipe(
      map(([workflows, workflow]) => {
        return this.myWorkflowsService.convertEntriesToOrgEntryObject(workflows, workflow);
      })
    );

    this.hasGroupEntriesObject$ = this.groupEntriesObject$.pipe(
      map((orgToolObjects: OrgWorkflowObject<Workflow>[]) => {
        return orgToolObjects && orgToolObjects.length !== 0;
      })
    );
    this.hasGroupSharedEntriesObject$ = this.groupSharedEntriesObject$.pipe(
      map((orgToolObjects: OrgWorkflowObject<Workflow>[]) => {
        return orgToolObjects && orgToolObjects.length !== 0;
      })
    );
  }

  protected getMyEntries() {
    combineLatest([this.userQuery.user$, this.sessionQuery.entryType$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, entryType]) => {
        if (user && entryType) {
          this.myWorkflowsService.getMyEntries(user.id, entryType);
        }
      });
  }

  /**
   * Grabs the workflow from the webservice and loads it
   * @param workflow Selected workflow
   */
  selectEntry(workflow: Workflow | DockstoreTool | null): void {
    this.myWorkflowsService.selectEntry(workflow, this.entryType);
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    this.myWorkflowsService.registerEntry(this.entryType);
  }

  addToExistingWorkflows(): void {
    if (this.user) {
      this.userService.addUserToWorkflows(this.user.id);
    }
  }

  /**
   * Toggles the sidebar
   */
  public toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}

/**
 * When using this, T should always be Workflow
 *
 * @export
 * @interface OrgWorkflowObject
 * @template T
 */
export interface OrgWorkflowObject<T> extends OrgEntryObject<T> {
  // Swagger doesn't return an enum for this. Currently, some values present are:
  // github.com and bitbucket.org
  sourceControl: string;
  organization: string;
}
