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
import { SessionStore } from './session.store';
import { createSession } from './session.model';
import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {

  constructor(private sessionStore: SessionStore) { }

  setPublicPage(isPublic: boolean) {
    this.sessionStore.setState(state => {
      return {
        ...state,
        isPublic: isPublic
      };
    });
  }

  setRefreshMessage(message: string) {
    this.sessionStore.setState(state => {
      return {
        ...state,
        refreshMessage: message
      };
    });
  }
}
