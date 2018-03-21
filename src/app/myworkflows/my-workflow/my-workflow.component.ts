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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router/';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { Subject } from 'rxjs/Subject';

import { Workflow } from '../../shared/swagger';
import { AccountsService } from './../../loginComponents/accounts/external/accounts.service';
import { TokenService } from './../../loginComponents/token.service';
import { UserService } from './../../loginComponents/user.service';
import { DockstoreService } from './../../shared/dockstore.service';
import { TokenSource } from './../../shared/enum/token-source.enum';
import { ExtendedWorkflow } from './../../shared/models/ExtendedWorkflow';
import { ProviderService } from './../../shared/provider.service';
import { RefreshService } from './../../shared/refresh.service';
import { StateService } from './../../shared/state.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { Configuration } from './../../shared/swagger/configuration';
import { UrlResolverService } from './../../shared/url-resolver.service';
import { WorkflowService } from './../../shared/workflow.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyWorkflowsService } from './../myworkflows.service';

@Component({
  selector: 'app-my-workflow',
  templateUrl: './my-workflow.component.html',
  styleUrls: ['./my-workflow.component.scss'],
  providers: [MyWorkflowsService, ProviderService,
    DockstoreService]
})

export class MyWorkflowComponent implements OnInit, OnDestroy {
  hasGitHubToken = true;
  oneAtATime = true;
  workflow: any;
  user: any;
  workflows: any;
  private ngUnsubscribe: Subject<{}> = new Subject();
  public refreshMessage: string;
  public orgWorkflowsObject: Array<OrgWorkflowObject>;
  constructor(private myworkflowService: MyWorkflowsService, private configuration: Configuration,
    private usersService: UsersService, private userService: UserService, private tokenService: TokenService,
    private workflowService: WorkflowService, private authService: AuthService, private accountsService: AccountsService,
    private refreshService: RefreshService, private stateService: StateService, private router: Router, private location: Location,
    private registerWorkflowModalService: RegisterWorkflowModalService, private urlResolverService: UrlResolverService) {
  }

  link() {
    this.accountsService.link(TokenSource.GITHUB);
  }

  ngOnInit() {
    /**
     * This handles when the router changes url due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons
     */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const foundWorkflow = this.findWorkflowFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflowsObject);
        this.selectWorkflow(foundWorkflow);
      }
    });
    localStorage.setItem('page', '/my-workflows');
    this.configuration.apiKeys['Authorization'] = 'Bearer ' + this.authService.getToken();
    this.tokenService.hasGitHubToken$.subscribe(hasGitHubToken => this.hasGitHubToken = hasGitHubToken);
    this.workflowService.setWorkflow(null);
    this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        if (workflow) {
          this.setIsFirstOpen();
          this.updateActiveTab();
        }
      }
    );
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.usersService.userWorkflows(user.id).first().subscribe(workflows => {
          this.workflowService.setWorkflows(workflows);
        });
      }
    });
    this.workflowService.workflows$.takeUntil(this.ngUnsubscribe).subscribe(workflows => {
      if (workflows) {
        this.workflows = workflows;
        const sortedWorkflows = this.myworkflowService.sortORGWorkflows(workflows, this.user.username);
        /* For the first initial time, set the first tool to be the selected one */
        if (sortedWorkflows && sortedWorkflows.length > 0) {
          this.orgWorkflowsObject = this.convertNamespaceWorkflowsToOrgWorkflowsObject(sortedWorkflows);
          const foundWorkflow = this.findWorkflowFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflowsObject);
          if (foundWorkflow) {
            this.selectWorkflow(foundWorkflow);
          } else {
            const publishedWorkflow = this.getFirstPublishedWorkflow(sortedWorkflows);
            if (publishedWorkflow) {
              this.selectWorkflow(publishedWorkflow);
            } else {
              const theFirstWorkflow = sortedWorkflows[0].workflows[0];
              this.selectWorkflow(theFirstWorkflow);
            }
          }
        } else {
          this.selectWorkflow(null);
        }
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
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
   * @memberof MyWorkflowComponent
   */
  private updateActiveTab() {
    if (this.orgWorkflowsObject) {
      for (let i = 0; i < this.orgWorkflowsObject.length; i++) {
        if (this.workflow) {
          if (this.orgWorkflowsObject[i].unpublished.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
            this.orgWorkflowsObject[i].activeTab = 'unpublished';
            continue;
          }
          if (this.orgWorkflowsObject[i].published.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
            this.orgWorkflowsObject[i].activeTab = 'published';
            continue;
          }
          if (this.orgWorkflowsObject[i].published.length > 0) {
            this.orgWorkflowsObject[i].activeTab = 'published';
          } else {
            this.orgWorkflowsObject[i].activeTab = 'unpublished';
          }
        }
      }
    }
  }

  /**
   * Converts the deprecated nsWorkflows object to the new OrgWorkflowsObject contains:
   * an array of published and unpublished workflows
   * and which tab should be opened (published or unpublished)
   * Main reason to convert to the new object is because figuring it out which tab should be active on
   * the fly will result in function being executed far too many times (150 times)
   * @private
   * @param {Array<any>} nsWorkflows The original nsWorkflows object
   * @returns {Array<OrgWorkflowObject>} The new object with more properties
   * @memberof MyWorkflowComponent
   */

  private convertNamespaceWorkflowsToOrgWorkflowsObject(nsWorkflows: Array<any>): Array<OrgWorkflowObject> {
    const orgWorkflowsObject: Array<OrgWorkflowObject> = [];
    for (let i = 0; i < nsWorkflows.length; i++) {
      const orgWorkflowObject: OrgWorkflowObject = {
        sourceControl: '',
        isFirstOpen: false,
        organization: '',
        published: [],
        unpublished: [],
        activeTab: 'published'
      };
      const nsWorkflow: Array<Workflow> = nsWorkflows[i].workflows;
      orgWorkflowObject.isFirstOpen = nsWorkflows[i].isFirstOpen;
      orgWorkflowObject.sourceControl = nsWorkflows[i].sourceControl;
      orgWorkflowObject.organization = nsWorkflows[i].organization;
      orgWorkflowObject.published = nsWorkflow.filter((workflow: Workflow) => {
        return workflow.is_published;
      });
      orgWorkflowObject.unpublished = nsWorkflow.filter((workflow: Workflow) => {
        return !workflow.is_published;
      });
      orgWorkflowsObject.push(orgWorkflowObject);
    }
    return orgWorkflowsObject;
  }

  /**
   * Find the first published workflow in all of the organizations
   *
   * @private
   * @param {*} orgWorkflows The deprecated object containing all the workflows
   * @returns {Workflow} The first published workflow found, null if there aren't any
   * @memberof MyWorkflowComponent
   */
  private getFirstPublishedWorkflow(orgWorkflows: any): Workflow {
    for (let i = 0; i < orgWorkflows.length; i++) {
      const foundWorkflow = orgWorkflows[i]['workflows'].find((workflow: Workflow) => {
        return workflow.is_published === true;
      });
      if (foundWorkflow) {
        return foundWorkflow;
      }
    }
    return null;
  }

  /**
   * Determines the workflow to go to based on the URL
   * Null if there's no known workflow with that path
   * @private
   * @param {string} path The current URL
   * @param {Array<OrgWorkflowObject>} orgWorkflows The new object containing all the workflows seperated in into published and unpublished
   * @returns {ExtendedWorkflow} The matching workflow if it exists
   * @memberof MyWorkflowComponent
   */
  private findWorkflowFromPath(path: string, orgWorkflows: Array<OrgWorkflowObject>): ExtendedWorkflow {
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
   * Determines which accordion is expanded on the workflow selector sidebar
   *
   * @memberof MyWorkflowComponent
   */
  setIsFirstOpen() {
    if (this.orgWorkflowsObject && this.workflow) {
      for (let i = 0; i < this.orgWorkflowsObject.length; i++) {
        if (this.orgWorkflowsObject[i].published.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.orgWorkflowsObject[i].isFirstOpen = true;
          break;
        }
        if (this.orgWorkflowsObject[i].unpublished.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.orgWorkflowsObject[i].isFirstOpen = true;
          break;
        }
      }
    }
  }

  /**
   * Select which workflow to display in the workflow component
   *
   * @param {ExtendedWorkflow} workflow The workflow to display
   * @memberof MyWorkflowComponent
   */
  selectWorkflow(workflow: ExtendedWorkflow) {
    this.workflowService.setWorkflow(workflow);
    if (workflow) {
      this.router.navigateByUrl('/my-workflows/' + workflow.full_workflow_path);
    }
  }

  setModalGitURL(gitURL: string) {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showModal() {
    this.registerWorkflowModalService.setIsModalShown(true);
  }

  refreshAllWorkflows(): any {
    this.refreshService.refreshAllWorkflows(this.user.id);
  }

}
interface OrgWorkflowObject {
  sourceControl: string;
  organization: string;
  isFirstOpen: boolean;
  published: Array<Workflow>;
  unpublished: Array<Workflow>;
  activeTab: 'unpublished' | 'published';
}

