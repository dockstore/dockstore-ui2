/*
 *    Copyright 2018 OICR
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
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dockstore } from '../dockstore.model';
import { EntryType } from '../enum/entry-type';
import { SessionState, SessionStore } from './session.store';

@Injectable({
  providedIn: 'root',
})
export class SessionQuery extends Query<SessionState> {
  isPublic$: Observable<boolean> = this.select((session) => session.isPublic);
  entryType$: Observable<EntryType> = this.select((session) => session.entryType);
  entryTypeDisplayName$: Observable<string> = this.entryType$.pipe(
    map((entryType: EntryType) => {
      if (entryType === EntryType.AppTool) {
        return 'app tool';
      }
      return entryType + ''; // convert to string
    })
  );
  entryPageTitle$: Observable<string> = this.entryTypeDisplayName$.pipe(map((displayName: string) => displayName + 's'));
  myEntryPageTitle$: Observable<string> = this.entryType$.pipe(map((entryType: EntryType) => 'my ' + entryType + 's'));
  isService$: Observable<boolean> = this.entryType$.pipe(map((entryType) => entryType === EntryType.Service));
  isTool$: Observable<boolean> = this.entryType$.pipe(map((entryType) => entryType === EntryType.Tool));
  gitHubAppInstallationLink$: Observable<string> = this.entryType$.pipe(
    map((entryType: EntryType) => (entryType ? this.generateGitHubAppInstallationUrl(entryType) : null))
  );
  loadingDialog$: Observable<boolean> = this.select((session) => session.loadingDialog);
  constructor(protected store: SessionStore) {
    super(store);
  }

  /**
   * Generate the general GitHub App installation URL
   *
   * @param {EntryType} entryType  To determine which page the user currently is on
   * @returns {string}
   * @memberof WorkflowQuery
   */
  generateGitHubAppInstallationUrl(entryType: EntryType): string {
    let queryParams = new HttpParams();
    queryParams = queryParams.set('state', entryType);
    return Dockstore.GITHUB_APP_INSTALLATION_URL + '/installations/new?' + queryParams.toString();
  }
}
