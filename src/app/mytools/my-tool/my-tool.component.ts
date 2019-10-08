/*
 *     Copyright 2018 OICR
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
import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { AuthService } from 'ng2-ui-auth';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { RegisterToolComponent } from '../../container/register-tool/register-tool.component';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { Tool } from '../../container/register-tool/tool';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { includesValidation } from '../../shared/constants';
import { ContainerService } from '../../shared/container.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { MyEntry } from '../../shared/my-entry';
import { RefreshService } from '../../shared/refresh.service';
import { TokenQuery } from '../../shared/state/token.query';
import { DockstoreTool } from '../../shared/swagger';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { Configuration } from '../../shared/swagger/configuration';
import { ToolQuery } from '../../shared/tool/tool.query';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { UserQuery } from '../../shared/user/user.query';
import { MytoolsService } from '../mytools.service';

@Component({
  selector: 'app-my-tool',
  templateUrl: './my-tool.component.html',
  styleUrls: ['../../shared/styles/my-entry.component.scss'],
  providers: [MytoolsService]
})
export class MyToolComponent extends MyEntry implements OnInit {
  tools: any;
  tool: any;
  isRefreshing$: Observable<boolean>;
  readonly pageName = '/my-tools';
  private registerTool: Tool;
  public showSidebar = true;
  public groupEntriesObject$: Observable<Array<OrgToolObject>>;
  constructor(
    private mytoolsService: MytoolsService,
    protected configuration: Configuration,
    protected userQuery: UserQuery,
    protected authService: AuthService,
    protected activatedRoute: ActivatedRoute,
    private containerService: ContainerService,
    private dialog: MatDialog,
    private location: Location,
    private refreshService: RefreshService,
    protected accountsService: AccountsService,
    private registerToolService: RegisterToolService,
    protected tokenQuery: TokenQuery,
    protected sessionService: SessionService,
    protected urlResolverService: UrlResolverService,
    private router: Router,
    private containersService: ContainersService,
    private toolQuery: ToolQuery,
    private alertQuery: AlertQuery,
    protected sessionQuery: SessionQuery,
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
  }

  ngOnInit() {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(() => {
        this.selectEntry(this.mytoolsService.recomputeWhatToolToSelect(this.tools));
      });
    this.registerToolService.isModalShown.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isModalShown: boolean) => {
      if (isModalShown) {
        const dialogRef = this.dialog.open(RegisterToolComponent, { width: '600px' });
      } else {
        this.dialog.closeAll();
      }
    });
    this.commonMyEntriesOnInit();
    this.containerService.setTool(null);
    this.containerService.setTools(null);
    this.toolQuery.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
      this.tool = tool;
    });

    this.getMyEntries();

    this.containerService.tools$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tools => {
      this.tools = tools;
      this.selectEntry(this.mytoolsService.recomputeWhatToolToSelect(tools));
    });

    this.groupEntriesObject$ = combineLatest([this.containerService.tools$, this.toolQuery.tool$]).pipe(
      map(combinedObservable => {
        const tools = combinedObservable[0];
        const tool = combinedObservable[1];
        const orgToolObjects: OrgToolObject[] = this.mytoolsService.convertToolsToOrgToolObject(tools);
        this.mytoolsService.recursiveSortOrgToolObjects(orgToolObjects);
        this.mytoolsService.setExpand(orgToolObjects, tool);
        return orgToolObjects;
      })
    );
    this.hasGroupEntriesObject$ = this.groupEntriesObject$.pipe(
      map((orgToolObjects: OrgToolObject[]) => {
        return orgToolObjects && orgToolObjects.length !== 0;
      })
    );
    this.registerToolService.tool.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => (this.registerTool = tool));
  }

  private getMyEntries() {
    combineLatest([this.userQuery.user$, this.sessionQuery.entryType$])
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, entryType]) => {
        if (user && entryType) {
          this.mytoolsService.getMyEntries(user.id, entryType);
        }
      });
  }

  selectEntry(tool: ExtendedDockstoreTool): void {
    if (tool !== null) {
      this.containersService
        .getContainer(tool.id, includesValidation)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.location.go(this.pageName + '/' + result.tool_path);
          this.containerService.setTool(result);
        });
    }
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

  refreshAllEntries(): void {
    this.refreshService.refreshAllTools(this.user.id);
  }

  /**
   * Toggles the sidebar
   */
  public toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }
}

export interface OrgToolObject {
  registry: string;
  namespace: string;
  published: Array<DockstoreTool>;
  unpublished: Array<DockstoreTool>;
  expanded: boolean;
}
