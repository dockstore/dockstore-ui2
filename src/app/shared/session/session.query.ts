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
import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntryType } from '../enum/entry-type';
import { EntryType as OpenApiEntryType, EntryTypeMetadata } from 'app/shared/openapi';
import { EntryTypeMetadataService } from 'app/entry/type-metadata/entry-type-metadata.service';
import { SessionState, SessionStore } from './session.store';

@Injectable({
  providedIn: 'root',
})
export class SessionQuery extends Query<SessionState> {
  isPublic$: Observable<boolean> = this.select((session) => session.isPublic);
  entryType$: Observable<EntryType> = this.select((session) => session.entryType);
  entryTypeMetadata$: Observable<EntryTypeMetadata> = this.entryType$.pipe(
    map((entryType: EntryType) => this.entryTypeMetadataService.get(entryType.toUpperCase() as OpenApiEntryType))
  );
  entryTypeDisplayName$: Observable<string> = this.entryType$.pipe(
    map((entryType: EntryType) => {
      if (entryType === EntryType.AppTool) {
        return 'app tool';
      }
      return entryType + ''; // convert to string
    })
  );
  entryPageTitle$: Observable<string> = this.entryTypeDisplayName$.pipe(map((displayName: string) => displayName + 's'));
  myEntryPageTitle$: Observable<string> = this.entryType$.pipe(map((entryType: EntryType) => 'My Dockstore: ' + entryType + 's'));
  isService$: Observable<boolean> = this.entryType$.pipe(map((entryType) => entryType === EntryType.Service));
  isNotebook$: Observable<boolean> = this.entryType$.pipe(map((entryType) => entryType === EntryType.Notebook));
  isTool$: Observable<boolean> = this.entryType$.pipe(map((entryType) => entryType === EntryType.Tool));
  loadingDialog$: Observable<boolean> = this.select((session) => session.loadingDialog);
  constructor(protected store: SessionStore, private entryTypeMetadataService: EntryTypeMetadataService) {
    super(store);
  }
}
