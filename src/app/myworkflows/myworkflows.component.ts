import { Location } from '@angular/common';
import { WorkflowsService } from './../shared/swagger/api/workflows.service';
import { NavigationEnd } from '@angular/router/';
import { Router } from '@angular/router';
/**
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';

import { DockstoreService } from '../shared/dockstore.service';
import { ProviderService } from '../shared/provider.service';
import { StateService } from '../shared/state.service';
import { WorkflowService } from '../shared/workflow.service';
import { AccountsService } from './../loginComponents/accounts/external/accounts.service';
import { TokenService } from './../loginComponents/token.service';
import { UserService } from './../loginComponents/user.service';
import { TokenSource } from './../shared/enum/token-source.enum';
import { ExtendedWorkflow } from './../shared/models/ExtendedWorkflow';
import { RefreshService } from './../shared/refresh.service';
import { UsersService } from './../shared/swagger/api/users.service';
import { Configuration } from './../shared/swagger/configuration';
import { UrlResolverService } from './../shared/url-resolver.service';
import { RegisterWorkflowModalService } from './../workflow/register-workflow-modal/register-workflow-modal.service';
import { MyWorkflowsService } from './myworkflows.service';

@Component({
  selector: 'app-myworkflows',
  templateUrl: './myworkflows.component.html',
  styleUrls: ['./myworkflows.component.css'],
  providers: [MyWorkflowsService, ProviderService,
    DockstoreService]
})
export class MyWorkflowsComponent implements OnInit {
  hasGitHubToken = true;
  orgWorkflows = [];
  oneAtATime = true;
  workflow: any;
  user: any;
  workflows: any;
  public refreshMessage: string;
  constructor() {
  }

  ngOnInit() {
  }
}
