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
import { Injectable, OnDestroy } from '@angular/core';
import { AuthService } from 'ng2-ui-auth';
import { Subject } from 'rxjs/Subject';

import { AccountsService } from '../loginComponents/accounts/external/accounts.service';
import { TokenService } from '../loginComponents/token.service';
import { OrgToolObject } from '../mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from '../myworkflows/my-workflow/my-workflow.component';
import { TokenSource } from './enum/token-source.enum';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { Configuration, DockstoreTool, Workflow } from './swagger';

@Injectable()
export abstract class MyEntry implements OnDestroy {
    readonly abstract pageName: string;
    oneAtATime = true;
    user: any;
    public hasGitHubToken = true;
    protected ngUnsubscribe: Subject<{}> = new Subject();
    constructor(protected accountsService: AccountsService, protected authService: AuthService, protected configuration: Configuration,
        protected tokenService: TokenService) { }

    link() {
        this.accountsService.link(TokenSource.GITHUB);
    }

    protected abstract updateActiveTab(): void;
    protected abstract convertOldNamespaceObjectToOrgEntriesObject(nsObject: Array<any>): Array<OrgToolObject> | Array<OrgWorkflowObject>;
    protected abstract getFirstPublishedEntry(orgEntries: Array<OrgToolObject> | Array<OrgWorkflowObject>): (DockstoreTool | Workflow);
    public abstract findEntryFromPath(path: string, orgEntries: (Array<OrgToolObject> | Array<OrgWorkflowObject>));
    public abstract setIsFirstOpen(): void;
    public abstract selectEntry(entry: (ExtendedDockstoreTool | ExtendedWorkflow)): void;
    public abstract setRegisterEntryModalInfo(gitURLOrNamespace: String): void;
    public abstract showRegisterEntryModal(): void;
    public abstract refreshAllEntries(): void;

    commonMyEntriesOnInit(): void {
        localStorage.setItem('page', this.pageName);
        this.configuration.apiKeys['Authorization'] = 'Bearer ' + this.authService.getToken();
        this.tokenService.hasGitHubToken$.subscribe(hasGitHubToken => this.hasGitHubToken = hasGitHubToken);
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
