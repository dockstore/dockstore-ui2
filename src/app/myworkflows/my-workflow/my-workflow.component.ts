import { Location } from '@angular/common';
import { ExtendedWorkflow } from './../../shared/models/ExtendedWorkflow';
import { TokenSource } from './../../shared/enum/token-source.enum';
import { UrlResolverService } from './../../shared/url-resolver.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { RefreshService } from './../../shared/refresh.service';
import { WorkflowService } from './../../shared/workflow.service';
import { StateService } from './../../shared/state.service';
import { AuthService } from 'ng2-ui-auth/commonjs/auth.service';
import { Router, NavigationEnd } from '@angular/router/';
import { AccountsService } from './../../loginComponents/accounts/external/accounts.service';
import { TokenService } from './../../loginComponents/token.service';
import { UsersService } from './../../shared/swagger/api/users.service';
import { UserService } from './../../loginComponents/user.service';
import { Configuration } from './../../shared/swagger/configuration';
import { MyWorkflowsService } from './../myworkflows.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-workflow',
  templateUrl: './my-workflow.component.html',
  styleUrls: ['./my-workflow.component.scss']
})
export class MyWorkflowComponent implements OnInit {
  hasGitHubToken = true;
  orgWorkflows = [];
  oneAtATime = true;
  workflow: any;
  user: any;
  workflows: any;
  public refreshMessage: string;
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
    localStorage.setItem('page', '/my-workflows');
    this.configuration.apiKeys['Authorization'] = 'Bearer ' + this.authService.getToken();
    this.tokenService.hasGitHubToken$.subscribe(hasGitHubToken => this.hasGitHubToken = hasGitHubToken);
    this.router.events.subscribe(event => {
      console.log(event);
      if (event instanceof NavigationEnd) {
        const foundWorkflow = this.findWorkflowFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflows);
        this.selectWorkflow(foundWorkflow);
      }
    });
    this.workflowService.setWorkflow(null);
    this.workflowService.workflow$.subscribe(
      workflow => {
        this.workflow = workflow;
        this.setIsFirstOpen();
      }
    );
    this.userService.user$.subscribe(user => {
      if (user) {
        this.user = user;
        this.usersService.userWorkflows(user.id).subscribe(workflows => {
          this.workflowService.setWorkflows(workflows);
        });
      }
    });
    this.workflowService.workflows$.subscribe(workflows => {
      this.workflows = workflows;
      if (this.user) {
        const sortedWorkflows = this.myworkflowService.sortORGWorkflows(workflows, this.user.username);
        this.workflowService.setNsWorkflows(sortedWorkflows);
      }
    });
    this.workflowService.nsWorkflows$.subscribe(nsWorkflows => {
      this.orgWorkflows = nsWorkflows;
      if (this.orgWorkflows && this.orgWorkflows.length > 0) {
        const foundWorkflow = this.findWorkflowFromPath(this.urlResolverService.getEntryPathFromUrl(), this.orgWorkflows);
        const theFirstWorkflow = this.orgWorkflows[0].workflows[0];
        if (foundWorkflow) {
          this.selectWorkflow(foundWorkflow);
        } else {
          this.selectWorkflow(theFirstWorkflow);
        }
      } else {
        this.selectWorkflow(null);
      }
    });
    this.stateService.refreshMessage$.subscribe(refreshMessage => this.refreshMessage = refreshMessage);
  }

  private goToWorkflow(workflow: ExtendedWorkflow): void {
    this.workflowService.setWorkflow(workflow);
    this.location.go('/my-workflows/' + workflow.full_workflow_path);
  }

  private findWorkflowFromPath(path: string, orgWorkflows: any[]): ExtendedWorkflow {
    let matchingWorkflow: ExtendedWorkflow;
    orgWorkflows.forEach((orgWorkflow)  => {
      orgWorkflow.workflows.forEach(workflow => {
        if (workflow.path === path) {
          matchingWorkflow = workflow;
        }
      });
    });
    return matchingWorkflow;
  }

  setIsFirstOpen() {
    if (this.orgWorkflows && this.workflow) {
      for (const orgObj of this.orgWorkflows) {
        if (this.containSelectedWorkflow(orgObj)) {
          orgObj.isFirstOpen = true;
          break;
        }
      }
    }
  }
  containSelectedWorkflow(orgObj) {
    const workflows: Array<any> = orgObj.workflows;
    if (workflows.find(workflow => workflow.id === this.workflow.id)) {
      return true;
    } else {
      return false;
    }
  }
  selectWorkflow(workflow: ExtendedWorkflow) {
    this.workflowService.setWorkflow(workflow);
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

