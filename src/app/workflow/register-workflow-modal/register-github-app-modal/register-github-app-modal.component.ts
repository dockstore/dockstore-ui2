/*
 *    Copyright 2023 OICR, UCSC
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

import { Component, Inject, OnInit } from '@angular/core';
import { SessionQuery } from 'app/shared/session/session.query';
import { UserQuery } from 'app/shared/user/user.query';
import { Observable } from 'rxjs';
import { AlertQuery } from '../../../shared/alert/state/alert.query';
import { Dockstore } from '../../../shared/dockstore.model';
import { RegisterWorkflowModalService } from '../register-workflow-modal.service';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { EntryType } from 'app/shared/enum/entry-type';

@Component({
  selector: 'app-register-github-app-modal',
  templateUrl: './register-github-app-modal.component.html',
  styleUrls: ['../register-workflow-modal.component.scss'],
})
export class RegisterGithubAppModalComponent implements OnInit {
  public EntryType = EntryType;
  public isRefreshing$: Observable<boolean>;
  public gitHubAppInstallationLink$: Observable<string>;
  public isUsernameChangeRequired$: Observable<boolean>;
  public username$: Observable<string>;
  Dockstore = Dockstore;

  constructor(
    @Inject(MAT_DIALOG_DATA) public entryType: string,
    private registerWorkflowModalService: RegisterWorkflowModalService,
    private alertQuery: AlertQuery,
    protected sessionQuery: SessionQuery,
    private userQuery: UserQuery
  ) {}

  ngOnInit() {
    this.username$ = this.userQuery.username$;
    this.isUsernameChangeRequired$ = this.userQuery.isUsernameChangeRequired$;
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.gitHubAppInstallationLink$ = this.sessionQuery.gitHubAppInstallationLandingPageLink$;
  }

  clearWorkflowRegisterError(): void {
    this.registerWorkflowModalService.clearWorkflowRegisterError();
  }
}
