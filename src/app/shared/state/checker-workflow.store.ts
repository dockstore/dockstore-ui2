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
import { Entry, Workflow } from '../swagger';

export interface CheckerWorkflowState {
  entry: Entry;
  checkerWorkflow: Workflow;
}

export function createInitialState(): CheckerWorkflowState {
  return {
    entry: null,
    checkerWorkflow: null
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'checkerWorkflow' })
export class CheckerWorkflowStore extends Store<CheckerWorkflowState> {
  constructor() {
    super(createInitialState());
  }
}
