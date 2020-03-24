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
import { Store, StoreConfig } from '@datorama/akita';
import { EntryType } from '../enum/entry-type';

export interface SessionState {
  isPublic: boolean;
  entryType: EntryType;
  // This should be the loading bar stickied to the top of each dialog
  loadingDialog: boolean;
}
export function createInitialState(): SessionState {
  return {
    isPublic: true,
    entryType: null,
    loadingDialog: false
  };
}
/**
 * This store is for app-wide state information such as:
 * whether the current public page or not
 * what type of entry is currently viewed
 * what user is logged in currently
 * @export
 * @class SessionStore
 * @extends {Store<SessionState>}
 */
@Injectable({
  providedIn: 'root'
})
@StoreConfig({ name: 'session' })
export class SessionStore extends Store<SessionState> {
  constructor() {
    super(createInitialState());
  }
}
