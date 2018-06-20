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
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
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
  workflow: Workflow;
  workflows: any;
  sharedWorkflows: any;
  readonly pageName = '/my-workflows';
  public refreshMessage: string;
  public showSidebar = true;
  private user: any;
  constructor(private myworkflowService: MyWorkflowsService, protected configuration: Configuration,
    private usersService: UsersService, private userService: UserService, protected tokenService: TokenService,
    private workflowService: WorkflowService, protected authService: AuthService,
    protected accountsService: AccountsService, private refreshService: RefreshService, private stateService: StateService,
    private router: Router, private location: Location, private registerWorkflowModalService: RegisterWorkflowModalService,
    protected urlResolverService: UrlResolverService, private workflowsService: WorkflowsService) {
    super(accountsService, authService, configuration, tokenService, urlResolverService);
  }

  ngOnInit() {
    /**
     * This handles when the router changes url due to when the user clicks the 'view checker workflow' or 'view parent entry' buttons.
     * It is the only section of code that does not exist in my-tools
     */
    this.router.events.takeUntil(this.ngUnsubscribe).subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (this.groupEntriesObject && this.groupSharedEntriesObject) {
          const foundWorkflow = this.findEntryFromPath(this.urlResolverService.getEntryPathFromUrl(),
            this.groupEntriesObject.concat(this.groupSharedEntriesObject));
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

        this.workflowsService.sharedWorkflows().first().subscribe(workflows => {
          this.workflowService.setSharedWorkflows(workflows);
        });
      }
    });
    this.workflowService.workflows$.takeUntil(this.ngUnsubscribe).subscribe(workflows => {
      if (workflows) {
        this.workflows = workflows;
        const sortedWorkflows = this.myworkflowService.sortGroupEntries(workflows, this.user.username, 'workflow');
        this.setGroupEntriesObject(sortedWorkflows);
        this.selectInitialEntry(sortedWorkflows);
      }
    });
    this.workflowService.sharedWorkflows$.takeUntil(this.ngUnsubscribe).subscribe(workflows => {
      if (workflows) {
        this.sharedWorkflows = workflows;
        const sortedWorkflows = this.myworkflowService.sortGroupEntries(workflows, this.user.username, 'workflow');
        this.setSortedSharedWorkflows(sortedWorkflows);
        if (this.workflow === undefined || this.workflow === null) {
          this.selectInitialEntry(sortedWorkflows);
        }
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
  }

  /**
   * Sets the sorted entries for display in dropdowns
   * @param sortedEntries Array of sorted entries
   */
  public setSortedSharedWorkflows(sortedEntries: any): void {
    this.groupSharedEntriesObject = this.convertOldNamespaceObjectToOrgEntriesObject(sortedEntries);
  }

  public toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  protected updateActiveTab(): void {
    if (this.groupEntriesObject) {
      for (let i = 0; i < this.groupEntriesObject.length; i++) {
        if (this.workflow) {
          if (this.groupEntriesObject[i].unpublished.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
            this.groupEntriesObject[i].activeTab = 'unpublished';
            continue;
          }
          if (this.groupEntriesObject[i].published.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
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

  protected convertOldNamespaceObjectToOrgEntriesObject(nsWorkflows: Array<any>): Array<OrgWorkflowObject> {
    const groupEntriesObject: Array<OrgWorkflowObject> = [];
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

  setIsFirstOpen(): void {
    if (this.groupEntriesObject && this.workflow) {
      for (let i = 0; i < this.groupEntriesObject.length; i++) {
        if (this.groupEntriesObject[i].published.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.groupEntriesObject[i].isFirstOpen = true;
          break;
        }
        if (this.groupEntriesObject[i].unpublished.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.groupEntriesObject[i].isFirstOpen = true;
          break;
        }
      }
    }

    if (this.groupSharedEntriesObject && this.workflow) {
      for (let i = 0; i < this.groupSharedEntriesObject.length; i++) {
        if (this.groupSharedEntriesObject[i].published.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.groupSharedEntriesObject[i].isFirstOpen = true;
          break;
        }
        if (this.groupSharedEntriesObject[i].unpublished.find((workflow: Workflow) => workflow.id === this.workflow.id)) {
          this.groupSharedEntriesObject[i].isFirstOpen = true;
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
