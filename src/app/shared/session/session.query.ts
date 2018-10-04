import { Query } from '@datorama/akita';
import { Session } from './session.model';
import { SessionStore, SessionState } from './session.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class SessionQuery extends Query<SessionState> {
  refreshing$: Observable<boolean> = this.select(session => !!session.refreshMessage);
  refreshMessage$: Observable<string> = this.select(session => session.refreshMessage);
  isPublic$: Observable<boolean> = this.select(session => session.isPublic);
  constructor(protected store: SessionStore) {
    super(store);
  }
}
