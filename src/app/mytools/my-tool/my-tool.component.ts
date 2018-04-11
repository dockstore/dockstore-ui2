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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Subject } from 'rxjs/Subject';

import { RegisterToolService } from '../../container/register-tool/register-tool.service';
import { AccountsService } from '../../loginComponents/accounts/external/accounts.service';
import { UserService } from '../../loginComponents/user.service';
import { CommunicatorService } from '../../shared/communicator.service';
import { DockstoreService } from '../../shared/dockstore.service';
import { ExtendedDockstoreTool } from '../../shared/models/ExtendedDockstoreTool';
import { RefreshService } from '../../shared/refresh.service';
import { StateService } from '../../shared/state.service';
import { DockstoreTool } from '../../shared/swagger';
import { UrlResolverService } from '../../shared/url-resolver.service';
import { MytoolsService } from '../mytools.service';
import { Tool } from './../../container/register-tool/tool';
import { TokenService } from './../../loginComponents/token.service';
import { ContainerService } from './../../shared/container.service';
import { TokenSource } from './../../shared/enum/token-source.enum';
import { UsersService } from './../../shared/swagger/api/users.service';
import { Configuration } from './../../shared/swagger/configuration';

@Component({
  selector: 'app-my-tool',
  templateUrl: './my-tool.component.html',
  styleUrls: ['./my-tool.component.scss'],
  providers: [MytoolsService, DockstoreService]
})
export class MyToolComponent implements OnInit, OnDestroy {
  oneAtATime = true;
  tools: any;
  user: any;
  tool: any;
  public hasGitHubToken = true;
  private ngUnsubscribe: Subject<{}> = new Subject();
  public refreshMessage: string;
  private registerTool: Tool;
  public orgToolsObject: Array<OrgToolObject>;
  constructor(private mytoolsService: MytoolsService, private configuration: Configuration,
    private communicatorService: CommunicatorService, private usersService: UsersService,
    private userService: UserService, private authService: AuthService, private stateService: StateService,
    private containerService: ContainerService,
    private refreshService: RefreshService, private accountsService: AccountsService,
    private registerToolService: RegisterToolService, private tokenService: TokenService,
    private urlResolverService: UrlResolverService, private router: Router) { }

  link() {
    this.accountsService.link(TokenSource.GITHUB);
  }

  ngOnInit() {
    localStorage.setItem('page', '/my-tools');
    this.configuration.apiKeys['Authorization'] = 'Bearer ' + this.authService.getToken();
    this.tokenService.hasGitHubToken$.subscribe(hasGitHubToken => this.hasGitHubToken = hasGitHubToken);
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
        const sortedContainers = this.mytoolsService.sortNSContainers(tools, this.user.username);
        /* For the first initial time, set the first tool to be the selected one */
        if (sortedContainers && sortedContainers.length > 0) {
          this.orgToolsObject = this.convertNamespaceToolsToOrgToolsObject(sortedContainers);
          const foundTool = this.findToolFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgToolsObject);
          if (foundTool) {
            this.selectContainer(foundTool);
          } else {
            const publishedTool = this.getFirstPublishedEntry(sortedContainers);
            if (publishedTool) {
              this.selectContainer(publishedTool);
            } else {
              const theFirstTool = sortedContainers[0].containers[0];
              this.selectContainer(theFirstTool);
            }
          }
        } else {
          this.selectContainer(null);
        }
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
    this.registerToolService.tool.subscribe(tool => this.registerTool = tool);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

/**
   * This figures out which tab (Published/Unpublished) is active
   * In order of priority:
   * 1. If the selected entry is published/unpublished, the tab selected will published/unpublished to reflect it
   * 2. If there are published entries, the published tab will be selected
   * 3. Unpublished otherwise
   * @private
   * @memberof MyToolComponent
   */
  private updateActiveTab() {
    if (this.orgToolsObject) {
      for (let i = 0; i < this.orgToolsObject.length; i++) {
        if (this.tool) {
          if (this.orgToolsObject[i].unpublished.find((tool: DockstoreTool) => tool.id === this.tool.id)) {
            this.orgToolsObject[i].activeTab = 'unpublished';
            continue;
          }
          if (this.orgToolsObject[i].published.find((tool: DockstoreTool) => tool.id === this.tool.id)) {
            this.orgToolsObject[i].activeTab = 'published';
            continue;
          }
          if (this.orgToolsObject[i].published.length > 0) {
            this.orgToolsObject[i].activeTab = 'published';
          } else {
            this.orgToolsObject[i].activeTab = 'unpublished';
          }
        }
      }
    }
  }

  /**
 * Converts the deprecated nsTool object to the new OrgToolsObject contains:
 * an array of published and unpublished tools
 * and which tab should be opened (published or unpublished)
 * Main reason to convert to the new object is because figuring it out which tab should be active on
 * the fly will result in function being executed far too many times (150 times)
 * @private
 * @param {Array<any>} nsTools The original nsTools object
 * @returns {Array<OrgToolObject>} The new object with more properties
 * @memberof MyToolsComponent
 */
  private convertNamespaceToolsToOrgToolsObject(nsTools: Array<any>): Array<OrgToolObject> {
    const orgToolsObject: Array<OrgToolObject> = [];
    for (let i = 0; i < nsTools.length; i++) {
      const orgToolObject: OrgToolObject = {
        namespace: '',
        isFirstOpen: false,
        organization: '',
        published: [],
        unpublished: [],
        activeTab: 'published'
      };
      const nsTool: Array<DockstoreTool> = nsTools[i].containers;
      orgToolObject.isFirstOpen = nsTools[i].isFirstOpen;
      orgToolObject.namespace = nsTools[i].namespace;
      orgToolObject.organization = nsTools[i].organization;
      orgToolObject.published = nsTool.filter((tool: DockstoreTool) => {
        return tool.is_published;
      });
      orgToolObject.unpublished = nsTool.filter((tool: DockstoreTool) => {
        return !tool.is_published;
      });
      orgToolsObject.push(orgToolObject);
    }
    return orgToolsObject;
  }

  /**
   * Find the first published tool in all of the organizations
   *
   * @private
   * @param {*} orgEntries The deprecated object containing all the tools
   * @returns {DockstoreTool} The first published tool found, null if there aren't any
   * @memberof MyToolComponent
   */
  private getFirstPublishedEntry(orgEntries: any): DockstoreTool {
    for (let i = 0; i < orgEntries.length; i++) {
      const foundTool = orgEntries[i]['containers'].find((entry: DockstoreTool) => {
        return entry.is_published === true;
      });
      if (foundTool) {
        return foundTool;
      }
    }
    return null;
  }

  /**
   * Determines the tool to go to based on the URL
   * Null if there's no known tool with that path
   * @private
   * @param {string} path The current URL
   * @param {Array<OrgToolObject>} orgTools The new object containing all the tools seperated in into published and unpublished
   * @returns {ExtendedDockstoreTool} The matching tool if it exists
   * @memberof MyToolComponent
   */
  private findToolFromPath(path: string, orgTools: Array<OrgToolObject>): ExtendedDockstoreTool {
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

  /**
   * Determines which accordion is expanded on the tool selector sidebar
   *
   * @memberof MyToolComponent
   */
  setIsFirstOpen() {
    if (this.orgToolsObject && this.tool) {
      for (let i = 0; i < this.orgToolsObject.length; i++) {
        if (this.orgToolsObject[i].published.find((entry: DockstoreTool) => entry.id === this.tool.id)) {
          this.orgToolsObject[i].isFirstOpen = true;
          break;
        }
        if (this.orgToolsObject[i].unpublished.find((entry: DockstoreTool) => entry.id === this.tool.id)) {
          this.orgToolsObject[i].isFirstOpen = true;
          break;
        }
      }
    }
  }

  selectContainer(tool) {
    this.containerService.setTool(tool);
    if (tool) {
      this.router.navigateByUrl('/my-tools/' + tool.tool_path);
    }
  }

  setModalGitPathAndImgPath(namespace: string) {
    const namespaceArray = namespace.split('/');
    const path = namespaceArray[1] + '/new_tool';
    this.registerTool.gitPath = path;
    this.registerTool.imagePath = path;
    this.registerToolService.setTool(this.registerTool);
  }

  showRegisterToolModal() {
    this.registerToolService.setIsModalShown(true);
  }

  refreshAllTools() {
    this.refreshService.refreshAllTools(this.user.id);
  }
}

interface OrgToolObject {
  namespace: string;
  organization: string;
  isFirstOpen: boolean;
  published: Array<ExtendedDockstoreTool>;
  unpublished: Array<ExtendedDockstoreTool>;
  activeTab: 'unpublished' | 'published';
}
