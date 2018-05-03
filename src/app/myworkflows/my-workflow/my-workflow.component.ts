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
import { NavigationEnd, Router } from '@angular/router/';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';

import { MyEntry } from '../../shared/my-entry';
import { Workflow } from '../../shared/swagger';
import { AccountsService } from './../../loginComponents/accounts/external/accounts.service';
import { TokenService } from './../../loginComponents/token.service';
import { UserService } from './../../loginComponents/user.service';
import { DockstoreService } from './../../shared/dockstore.service';
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

export class MyWorkflowComponent extends MyEntry implements OnInit {
  workflow: any;
  workflows: any;
  readonly pageName = '/my-workflows';
  public refreshMessage: string;
  public orgWorkflowsObject: Array<OrgWorkflowObject>;
  constructor(private myworkflowService: MyWorkflowsService, protected configuration: Configuration,
    private usersService: UsersService, private userService: UserService, protected tokenService: TokenService,
    private workflowService: WorkflowService, protected authService: AuthService, protected accountsService: AccountsService,
    private refreshService: RefreshService, private stateService: StateService, private router: Router, private location: Location,
    private registerWorkflowModalService: RegisterWorkflowModalService, private urlResolverService: UrlResolverService) {
    super(accountsService, authService, configuration, tokenService);
  }

  ngOnInit() {
    /**
     * This handles when the router changes url due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons.
     * It is the only section of code that does not exist in my-tools
     */
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.orgWorkflowsObject) {
          const foundWorkflow = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflowsObject);
          this.selectEntry(foundWorkflow);
        }
      }
    });
    this.commonMyEntriesOnInit();
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
        const sortedWorkflows = this.myworkflowService.sortGroupEntries(workflows, this.user.username, 'organization');
        /* For the first initial time, set the first tool to be the selected one */
        if (sortedWorkflows && sortedWorkflows.length > 0) {
          this.orgWorkflowsObject = this.convertOldNamespaceObjectToOrgEntriesObject(sortedWorkflows);
          const foundWorkflow = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflowsObject);
          if (foundWorkflow) {
            this.selectEntry(foundWorkflow);
          } else {
            const publishedWorkflow = this.getFirstPublishedEntry(sortedWorkflows);
            if (publishedWorkflow) {
              this.selectEntry(publishedWorkflow);
            } else {
              const theFirstWorkflow = sortedWorkflows[0].entries[0];
              this.selectEntry(theFirstWorkflow);
            }
          }
        } else {
          this.selectEntry(null);
        }
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
  }

  protected updateActiveTab(): void {
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

  protected convertOldNamespaceObjectToOrgEntriesObject(nsWorkflows: Array<any>): Array<OrgWorkflowObject> {
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
      const nsWorkflow: Array<Workflow> = nsWorkflows[i].entries;
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

  setIsFirstOpen(): void {
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

  selectEntry(workflow: ExtendedWorkflow): void {
    this.workflowService.setWorkflow(workflow);
    if (workflow) {
      this.router.navigateByUrl('/my-workflows/' + workflow.full_workflow_path);
    }
  }

  setRegisterEntryModalInfo(gitURL: string): void {
    this.registerWorkflowModalService.setWorkflowRepository(gitURL);
  }

  showRegisterEntryModal(): void {
    this.registerWorkflowModalService.setIsModalShown(true);
  }

  refreshAllEntries(): void {
    this.refreshService.refreshAllWorkflows(this.user.id);
  }

}
export interface OrgWorkflowObject {
  sourceControl: string;
  organization: string;
  isFirstOpen: boolean;
  published: Array<Workflow>;
  unpublished: Array<Workflow>;
  activeTab: 'unpublished' | 'published';
}
