/*
 *     Copyright 2022 OICR, UCSC
 *
 *     Licensed under the Apache License, Version 2.0 (the "License")
 *     you may not use this file except in compliance with the License
 *     You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *     Unless required by applicable law or agreed to in writing, software
 *     distributed under the License is distributed on an "AS IS" BASIS
 *     WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *     See the License for the specific language governing permissions and
 *     limitations under the License.
 */
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router, RouterEvent } from '@angular/router';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RegisterToolComponent } from '../../container/register-tool/register-tool.component';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { Tool } from '../../container/register-tool/tool';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { OrgWorkflowObject } from '../../myworkflows/my-workflow/my-workflow.component';
import { MyWorkflowsService } from '../../myworkflows/myworkflows.service';
import { AuthService } from '../../ng2-ui-auth/public_api';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { bootstrap4largeModalSize } from '../../shared/constants';
import { ContainerService } from '../../shared/container.service';
import { MyEntry, OrgEntryObject } from '../../shared/my-entry';
import { TokenQuery } from '../../shared/state/token.query';
import { TokenService } from '../../shared/state/token.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { AppTool, DockstoreTool, Workflow } from '../../shared/openapi';
import { Configuration } from '../../shared/openapi/configuration';
import { ToolQuery } from '../../shared/tool/tool.query';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
import { MytoolsService } from '../mytools.service';
import { EntryType } from '../../shared/enum/entry-type';
import { UserService } from 'app/shared/user/user.service';
import { ContainerComponent } from '../../container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgIf, AsyncPipe, TitleCasePipe } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../header/header.component';
import { MySidebarComponent } from '../../my-sidebar/my-sidebar.component';
import { FlexModule } from '@ngbracket/ngx-layout/flex';
import { SidebarAccordionComponent } from '../sidebar-accordion/sidebar-accordion.component';
import { SidebarAccordionComponent as WorkflowSidebarAccordionComponent } from '../../myworkflows/sidebar-accordion/sidebar-accordion.component';
import { Dockstore } from 'app/shared/dockstore.model';

@Component({
  selector: 'app-my-tool',
  templateUrl: './my-tool.component.html',
  styleUrls: ['../../shared/styles/my-entry.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    MySidebarComponent,
    HeaderComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    NgIf,
    MatTooltipModule,
    MatMenuModule,
    SidebarAccordionComponent,
    WorkflowSidebarAccordionComponent,
    MatCardModule,
    FontAwesomeModule,
    ContainerComponent,
    AsyncPipe,
    TitleCasePipe,
  ],
})
export class MyToolComponent extends MyEntry implements OnInit {
  faGithub = faGithub;
  tools: any;
  apptools: Array<AppTool>;
  allTools: any;
  tool: any;
  tool$: Observable<DockstoreTool | null>;
  appTool: AppTool;
  isRefreshing$: Observable<boolean>;
  public hasGroupGitHubAppToolEntriesObjects$: Observable<boolean>;
  readonly pageName = '/my-tools';
  private registerTool: Tool;
  public showSidebar = true;
  public groupEntriesObject$: Observable<Array<OrgToolObject<DockstoreTool>>>;
  public groupAppToolEntryObjects$: Observable<Array<OrgWorkflowObject<Workflow>>>;
  EntryType = EntryType;
  Dockstore = Dockstore;
  constructor(
    private mytoolsService: MytoolsService,
    protected configuration: Configuration,
    protected userQuery: UserQuery,
    protected authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    private containerService: ContainerService,
    private dialog: MatDialog,
    protected accountsService: AccountsService,
    private registerToolService: RegisterToolService,
    protected tokenQuery: TokenQuery,
    protected sessionService: SessionService,
    protected urlResolverService: UrlResolverService,
    private router: Router,
    private toolQuery: ToolQuery,
    private alertQuery: AlertQuery,
    private alertService: AlertService,
    private tokenService: TokenService,
    protected sessionQuery: SessionQuery,
    protected myEntriesQuery: MyEntriesQuery,
    protected myEntriesStateService: MyEntriesStateService,
    protected myWorkflowsService: MyWorkflowsService,
    private workflowService: WorkflowService,
    protected workflowQuery: WorkflowQuery,
    private userService: UserService
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
  }

  ngOnInit() {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map((event) => event as NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((event: RouterEvent) => {
        this.allTools = this.tools.concat(this.apptools);
        this.selectEntry(this.mytoolsService.recomputeWhatEntryToSelect(this.allTools));
      });

    this.registerToolService.isModalShown.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isModalShown: boolean) => {
      if (isModalShown) {
        const dialogRef = this.dialog.open(RegisterToolComponent, { width: bootstrap4largeModalSize });
        dialogRef
          .afterClosed()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe(() => {
            this.alertService.clearEverything();
            this.registerToolService.setIsModalShown(false);
          });
      } else {
        this.dialog.closeAll();
      }
    });
    this.tokenService.getGitHubOrganizations();
    this.commonMyEntriesOnInit();
    this.containerService.setTool(null);
    this.containerService.setTools(null);
    this.workflowService.setWorkflow(null);
    this.workflowService.setWorkflows(null);
    this.tool$ = this.toolQuery.tool$;
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool) => {
      this.tool = tool;
    });
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((appTool) => {
      this.appTool = appTool;
    });

    this.getMyEntries();

    combineLatest([this.containerService.tools$, this.workflowService.workflows$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([tools, workflows]) => {
        if (tools && workflows) {
          this.tools = tools;
          this.apptools = workflows;
          this.allTools = this.tools.concat(this.apptools);
          this.selectEntry(this.mytoolsService.recomputeWhatEntryToSelect(this.allTools));
        }
      });

    this.groupEntriesObject$ = combineLatest([this.containerService.tools$, this.toolQuery.tool$]).pipe(
      map(([tools, tool]) => {
        return this.mytoolsService.convertEntriesToOrgEntryObject(tools, tool);
      })
    );

    this.groupAppToolEntryObjects$ = combineLatest([
      this.workflowService.workflows$,
      this.workflowQuery.workflow$,
      this.tokenQuery.gitHubOrganizations$,
    ]).pipe(
      map(([workflows, workflow, gitHubOrganizations]) => {
        return this.myWorkflowsService.convertEntriesToOrgEntryObject(workflows, workflow, gitHubOrganizations);
      })
    );

    this.hasGroupEntriesObject$ = this.groupEntriesObject$.pipe(
      map((orgToolObjects: OrgToolObject<DockstoreTool>[]) => {
        return orgToolObjects && orgToolObjects.length !== 0;
      })
    );

    this.hasGroupGitHubAppToolEntriesObjects$ = this.groupAppToolEntryObjects$.pipe(
      map((orgToolObjects: OrgWorkflowObject<Workflow>[]) => {
        // Now that we have empty GitHub orgs showing up, check if they have any entries
        return orgToolObjects && orgToolObjects.some((orgToolObject) => orgToolObject.unpublished.length || orgToolObject.published.length);
      })
    );

    this.registerToolService.tool.pipe(takeUntil(this.ngUnsubscribe)).subscribe((tool) => (this.registerTool = tool));
  }

  protected getMyEntries() {
    combineLatest([this.userQuery.user$, this.sessionQuery.entryType$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, entryType]) => {
        if (user && entryType) {
          this.mytoolsService.getMyEntries(user.id, entryType);
        }
      });
  }
  selectEntry(tool: DockstoreTool | Workflow): void {
    this.mytoolsService.selectEntry(tool);
  }

  setRegisterEntryModalInfo(namespace: string): void {
    const namespaceArray = namespace.split('/');
    const path = namespaceArray[1] + '/new_tool';
    this.registerTool.gitPath = path;
    this.registerTool.imagePath = path;
    this.registerToolService.setTool(this.registerTool);
  }

  showRegisterEntryModal(): void {
    this.registerToolService.setIsModalShown(true);
  }

  addToExistingTools(): void {
    if (this.user) {
      this.userService.addUserToWorkflows(this.user.id, EntryType.Tool);
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
 * When using this, T should always be DockstoreTool
 *
 * @export
 * @interface OrgToolObject
 * @template T
 */
export interface OrgToolObject<T> extends OrgEntryObject<T> {
  registry: string;
  namespace: string;
}
