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
import { MatDialog } from '@angular/material';
import { NavigationEnd, Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { first, takeUntil } from 'rxjs/operators';

import { RegisterToolComponent } from '../../container/register-tool/register-tool.component';
import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { Tool } from '../../container/register-tool/tool';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { TokenService } from '../../loginComponents/token.service';
import { UserService } from '../../loginComponents/user.service';
import { ContainerService } from '../../shared/container.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { MyEntry } from '../../shared/my-entry';
import { RefreshService } from '../../shared/refresh.service';
import { SessionQuery } from '../../shared/session/session.query';
import { SessionService } from '../../shared/session/session.service';
import { DockstoreTool } from '../../shared/swagger';
import { ContainersService } from '../../shared/swagger/api/containers.service';
import { UsersService } from '../../shared/swagger/api/users.service';
import { Configuration } from '../../shared/swagger/configuration';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { MytoolsService } from '../mytools.service';

@Component({
  selector: 'app-my-tool',
  templateUrl: './my-tool.component.html',
  styleUrls: ['./my-tool.component.scss'],
  providers: [MytoolsService, DockstoreService]
})
export class MyToolComponent extends MyEntry implements OnInit {
  tools: any;
  tool: any;
  readonly pageName = '/my-tools';
  public refreshMessage: string;
  private registerTool: Tool;
  public showSidebar = true;
  constructor(private mytoolsService: MytoolsService, protected configuration: Configuration, private usersService: UsersService,
    private userService: UserService, protected authService: AuthService, private sessionService: SessionService,
    private containerService: ContainerService, private dialog: MatDialog, private location: Location,
    private refreshService: RefreshService, protected accountsService: AccountsService,
    private registerToolService: RegisterToolService, protected tokenService: TokenService, private sessionQuery: SessionQuery,
    protected urlResolverService: UrlResolverService, private router: Router, private containersService: ContainersService) {
    super(accountsService, authService, configuration, tokenService, urlResolverService);
  }

  ngOnInit() {
    this.router.events.pipe(takeUntil(this.ngUnsubscribe)).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.groupEntriesObject) {
          const foundTool = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(),
            this.groupEntriesObject);
          this.selectEntry(foundTool);
        }
      }
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
    this.containerService.tool$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => {
      this.tool = tool;
    });

    this.userService.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => {
      if (user) {
        this.user = user;
        this.sessionService.setRefreshMessage('Fetching tools');
        this.usersService.userContainers(user.id).subscribe(tools => {
          this.containerService.setTools(tools);
          this.sessionService.setRefreshMessage(null);
        }, (error: any) => {
          this.sessionService.setRefreshMessage(null);
        });
      }
    });

    this.containerService.tools$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tools => {
      if (tools) {
        this.tools = tools;
        const sortedContainers = this.mytoolsService.sortGroupEntries(tools, this.user.username, 'tool');
        this.setGroupEntriesObject(sortedContainers);
        // Only select initial entry if there current is no selected entry.  Otherwise, leave as is.
        if (!this.tool) {
          if (this.tools.length > 0) {
            this.selectInitialEntry(sortedContainers);
          }
        }
      }
    });

    this.sessionQuery.refreshMessage$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.registerToolService.tool.pipe(takeUntil(this.ngUnsubscribe)).subscribe(tool => this.registerTool = tool);
  }

  protected convertOldNamespaceObjectToOrgEntriesObject(nsTools: Array<any>): Array<OrgToolObject> {
    const groupEntriesObject: Array<OrgToolObject> = [];
    for (let i = 0; i < nsTools.length; i++) {
      const orgToolObject: OrgToolObject = {
        namespace: '',
        organization: '',
        published: [],
        unpublished: []
      };
      const nsTool: Array<DockstoreTool> = nsTools[i].entries;
      orgToolObject.namespace = nsTools[i].namespace;
      orgToolObject.published = nsTool.filter((tool: DockstoreTool) => {
        return tool.is_published;
      });
      orgToolObject.unpublished = nsTool.filter((tool: DockstoreTool) => {
        return !tool.is_published;
      });
      groupEntriesObject.push(orgToolObject);
    }
    return groupEntriesObject;
  }

  protected getFirstPublishedEntry(orgEntries: Array<OrgToolObject>): DockstoreTool {
    for (let i = 0; i < orgEntries.length; i++) {
      const foundTool = orgEntries[i]['entries'].find((entry: DockstoreTool) => {
        return entry.is_published === true;
      });
      if (foundTool) {
        return foundTool;
      }
    }
    return null;
  }

  protected findEntryFromPath(path: string, orgTools: Array<OrgToolObject>): ExtendedDockstoreTool {
    let matchingTool: ExtendedDockstoreTool;
    for (let i = 0; i < orgTools.length; i++) {
      matchingTool = orgTools[i].published.find((tool: DockstoreTool) => tool.tool_path === path);
      if (matchingTool) {
        return matchingTool;
      }
      matchingTool = orgTools[i].unpublished.find((tool: DockstoreTool) => tool.tool_path === path);
      if (matchingTool) {
        return matchingTool;
      }
    }
    return null;
  }

  selectEntry(tool: ExtendedDockstoreTool): void {
    if (tool !== null) {
      this.containersService.getContainer(tool.id).pipe(takeUntil(this.ngUnsubscribe)).subscribe((result) => {
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
  namespace: string;
  organization: string;
  published: Array<ExtendedDockstoreTool>;
  unpublished: Array<ExtendedDockstoreTool>;
}
