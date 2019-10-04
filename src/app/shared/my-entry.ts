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
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountsService } from '../loginComponents/accounts/external/accounts.service';
import { OrgToolObject } from '../mytools/my-tool/my-tool.component';
import { OrgWorkflowObject } from '../myworkflows/my-workflow/my-workflow.component';
import { Base } from './base';
import { TokenSource } from './enum/token-source.enum';
import { ExtendedDockstoreTool } from './models/ExtendedDockstoreTool';
import { ExtendedWorkflow } from './models/ExtendedWorkflow';
import { SessionQuery } from './session/session.query';
import { SessionService } from './session/session.service';
import { MyEntriesQuery } from './state/my-entries.query';
import { MyEntriesStateService } from './state/my-entries.service';
import { TokenQuery } from './state/token.query';
import { Configuration, DockstoreTool, Workflow } from './swagger';
import { UrlResolverService } from './url-resolver.service';
import { UserQuery } from './user/user.query';

@Injectable()
export abstract class MyEntry extends Base implements OnDestroy {
  abstract readonly pageName: string;
  public refreshingMyEntries$: Observable<boolean>;
  oneAtATime = true;
  user: any;
  public hasGitHubToken = true;
  public groupEntriesObject: Array<any>;
  public groupSharedEntriesObject: Array<any>;
  public myEntryPageTitle$: Observable<string>;

  protected ngUnsubscribe: Subject<{}> = new Subject();
  constructor(
    protected accountsService: AccountsService,
    protected authService: AuthService,
    protected configuration: Configuration,
    protected tokenQuery: TokenQuery,
    protected urlResolverService: UrlResolverService,
    protected sessionQuery: SessionQuery,
    protected sessionService: SessionService,
    protected activatedRoute: ActivatedRoute,
    protected myEntriesQuery: MyEntriesQuery,
    protected userQuery: UserQuery,
    protected myEntriesStateService: MyEntriesStateService
  ) {
    super();
    this.sessionService.setEntryType(this.activatedRoute.snapshot.data['entryType']);
    this.myEntryPageTitle$ = this.sessionQuery.myEntryPageTitle$;
    this.refreshingMyEntries$ = this.myEntriesQuery.refreshingMyEntries$;
    this.userQuery.user$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(user => (this.user = user));
  }

  link() {
    this.accountsService.link(TokenSource.GITHUB);
  }

  /**
   * Converts the deprecated nsTool object to the new groupEntriesObject contains:
   * an array of published and unpublished tools
   * and which tab should be opened (published or unpublished)
   * Main reason to convert to the new object is because figuring it out which tab should be active on
   * the fly will result in function being executed far too many times (150 times)
   * @protected
   * @abstract
   * @param {Array<any>} nsObject The original nsTools or nsWorkflows object
   * @returns {(Array<OrgToolObject> | Array<OrgWorkflowObject>)} The new object with more properties
   * @memberof MyEntry
   */
  protected abstract convertOldNamespaceObjectToOrgEntriesObject(nsObject: Array<any>): Array<OrgToolObject> | Array<OrgWorkflowObject>;

  /**
   * Find the first published entry in all of the organizations
   * @protected
   * @abstract
   * @param {(Array<OrgToolObject> | Array<OrgWorkflowObject>)} orgEntries The deprecated object containing all the entries
   * @returns {((DockstoreTool | Workflow))} The first published entry found, null if there aren't any
   * @memberof MyEntry
   */
  protected abstract getFirstPublishedEntry(orgEntries: Array<OrgToolObject> | Array<OrgWorkflowObject>): DockstoreTool | Workflow | null;

  /**
   * Determines the tool to go to based on the URL
   * Null if there's no known tool with that path
   * @abstract
   * @param {string} path The current URL
   * @param {((Array<OrgToolObject> | Array<OrgWorkflowObject>))} orgEntries Object with entries seperated into published/unpublished
   * @returns {(ExtendedDockstoreTool | ExtendedWorkflow)} The matching entry if it exists
   * @memberof MyEntry
   */
  protected abstract findEntryFromPath(
    path: string,
    orgEntries: Array<OrgToolObject> | Array<OrgWorkflowObject>
  ): ExtendedDockstoreTool | ExtendedWorkflow | null;

  public abstract selectEntry(entry: ExtendedDockstoreTool | ExtendedWorkflow): void;
  public abstract setRegisterEntryModalInfo(gitURLOrNamespace: String): void;
  public abstract showRegisterEntryModal(): void;
  public abstract refreshAllEntries(): void;

  commonMyEntriesOnInit(): void {
    localStorage.setItem('page', this.pageName);
    const token = this.authService.getToken();
    this.configuration.apiKeys['Authorization'] = token ? 'Bearer ' + token : null;
    this.tokenQuery.hasGitHubToken$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(hasGitHubToken => (this.hasGitHubToken = hasGitHubToken));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Returns the concatenation of two arrays (properly deals with undefined)
   * @param arr1 Array 1
   * @param arr2  Array 2
   */
  combineArrays(arr1: Array<any>, arr2: Array<any>): Array<any> {
    arr1 = arr1 || [];
    arr2 = arr2 || [];
    return arr1.concat(arr2);
  }

  /**
   * Select the initially selected entry
   * @param sortedEntries Array of sorted entries
   */
  selectInitialEntry(sortedEntries: any): void {
    /* For the first initial time, set the first entry to be the selected one */
    if (sortedEntries && sortedEntries.length > 0) {
      const foundEntry = this.findEntryFromPath(
        this.urlResolverService.getEntryPathFromUrl(),
        this.combineArrays(this.groupEntriesObject, this.groupSharedEntriesObject)
      );
      if (foundEntry) {
        this.selectEntry(foundEntry);
      } else {
        const publishedEntry = this.getFirstPublishedEntry(sortedEntries);
        if (publishedEntry) {
          this.selectEntry(publishedEntry);
        } else {
          const theFirstEntry = sortedEntries[0].entries[0];
          this.selectEntry(theFirstEntry);
        }
      }
    } else {
      this.selectEntry(null);
    }
  }

  setGroupEntriesObject(sortedEntries: any): void {
    if (sortedEntries && sortedEntries.length > 0) {
      this.groupEntriesObject = this.convertOldNamespaceObjectToOrgEntriesObject(sortedEntries);
      this.myEntriesStateService.setGroupEntriesObject(this.groupEntriesObject);
    }
  }
}
