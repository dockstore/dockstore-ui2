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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';

import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { UserService } from '../../loginComponents/user.service';
import { CommunicatorService } from '../../shared/communicator.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { MyEntry } from '../../shared/my-entry';
import { RefreshService } from '../../shared/refresh.service';
import { StateService } from '../../shared/state.service';
import { DockstoreTool } from '../../shared/swagger';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { MytoolsService } from '../mytools.service';
import { Tool } from './../../container/register-tool/tool';
import { TokenService } from './../../loginComponents/token.service';
import { ContainerService } from './../../shared/container.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { Configuration } from './../../shared/swagger/configuration';

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
  constructor(private mytoolsService: MytoolsService, protected configuration: Configuration,
    private communicatorService: CommunicatorService, private usersService: UsersService,
    private userService: UserService, protected authService: AuthService, private stateService: StateService,
    private containerService: ContainerService,
    private refreshService: RefreshService, protected accountsService: AccountsService,
    private registerToolService: RegisterToolService, protected tokenService: TokenService,
    protected urlResolverService: UrlResolverService, private router: Router) {
    super(accountsService, authService, configuration, tokenService, urlResolverService);
  }

  ngOnInit() {
    this.commonMyEntriesOnInit();
    this.containerService.setTool(null);
    this.containerService.tool$.subscribe(tool => {
      this.tool = tool;
      if (tool) {
        this.setIsFirstOpen();
        this.updateActiveTab();
      }
    });
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.usersService.userContainers(user.id).first().subscribe(tools => {
          this.containerService.setTools(tools);
        });
      }
    });
    this.containerService.tools$.takeUntil(this.ngUnsubscribe).subscribe(tools => {
      if (tools) {
        this.tools = tools;
        const sortedContainers = this.mytoolsService.sortGroupEntries(tools, this.user.username, 'tool');
        this.selectInitialEntry(sortedContainers);
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.registerToolService.tool.subscribe(tool => this.registerTool = tool);
  }

  protected updateActiveTab(): void {
    if (this.groupEntriesObject) {
      for (let i = 0; i < this.groupEntriesObject.length; i++) {
        if (this.tool) {
          if (this.groupEntriesObject[i].unpublished.find((tool: DockstoreTool) => tool.id === this.tool.id)) {
            this.groupEntriesObject[i].activeTab = 'unpublished';
            continue;
          }
          if (this.groupEntriesObject[i].published.find((tool: DockstoreTool) => tool.id === this.tool.id)) {
            this.groupEntriesObject[i].activeTab = 'published';
            continue;
          }
          if (this.groupEntriesObject[i].published.length > 0) {
            this.groupEntriesObject[i].activeTab = 'published';
          } else {
            this.groupEntriesObject[i].activeTab = 'unpublished';
          }
        }
      }
    }
  }

  protected convertOldNamespaceObjectToOrgEntriesObject(nsTools: Array<any>): Array<OrgToolObject> {
    const groupEntriesObject: Array<OrgToolObject> = [];
    for (let i = 0; i < nsTools.length; i++) {
      const orgToolObject: OrgToolObject = {
        namespace: '',
        isFirstOpen: false,
        organization: '',
        published: [],
        unpublished: [],
        activeTab: 'published'
      };
      const nsTool: Array<DockstoreTool> = nsTools[i].entries;
      orgToolObject.isFirstOpen = nsTools[i].isFirstOpen;
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

  setIsFirstOpen(): void {
    if (this.groupEntriesObject && this.tool) {
      for (let i = 0; i < this.groupEntriesObject.length; i++) {
        if (this.groupEntriesObject[i].published.find((entry: DockstoreTool) => entry.id === this.tool.id)) {
          this.groupEntriesObject[i].isFirstOpen = true;
          break;
        }
        if (this.groupEntriesObject[i].unpublished.find((entry: DockstoreTool) => entry.id === this.tool.id)) {
          this.groupEntriesObject[i].isFirstOpen = true;
          break;
        }
      }
    }
  }

  selectEntry(tool: ExtendedDockstoreTool): void {
    this.containerService.setTool(tool);
    if (tool) {
      this.router.navigateByUrl(this.pageName + '/' + tool.tool_path);
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
}

export interface OrgToolObject {
  namespace: string;
  organization: string;
  isFirstOpen: boolean;
  published: Array<ExtendedDockstoreTool>;
  unpublished: Array<ExtendedDockstoreTool>;
  activeTab: 'unpublished' | 'published';
}
