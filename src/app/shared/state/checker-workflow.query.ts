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
import { ga4ghWorkflowIdPrefix } from '../constants';
import { SessionQuery } from '../session/session.query';
import { BioWorkflow, DockstoreTool, Entry, Workflow } from '../swagger';
import { CheckerWorkflowState, CheckerWorkflowStore } from './checker-workflow.store';

@Injectable({ providedIn: 'root' })
export class CheckerWorkflowQuery extends Query<CheckerWorkflowState> {
  entry$: Observable<Entry> = this.select(state => state.entry);
  entryId$: Observable<number> = this.entry$.pipe(map((entry: Entry) => (entry ? entry.id : null)));
  checkerWorkflow$: Observable<Workflow> = this.select(state => (state.checkerWorkflow ? state.checkerWorkflow : null));
  isStub$: Observable<boolean> = this.entry$.pipe(
    map((entry: Entry) => (this.isEntryAWorkflow(entry) ? (<Workflow>entry).mode === Workflow.ModeEnum.STUB : false))
  );
  checkerWorkflowPath$: Observable<string> = this.checkerWorkflow$.pipe(map(workflow => (workflow ? workflow.full_workflow_path : null)));
  parentId$: Observable<number> = this.entry$.pipe(map((entry: BioWorkflow) => (entry ? entry.parent_id : null)));
  checkerId$: Observable<number> = this.entry$.pipe(map((entry: Entry) => (entry ? entry.checker_id : null)));
  entryIsWorkflow$: Observable<boolean> = this.entry$.pipe(map((entry: Entry) => (entry ? this.isEntryAWorkflow(entry) : null)));
  trsId$: Observable<string | null> = this.entry$.pipe(map((entry: Entry | null) => this.getTRSId(entry)));
  constructor(protected store: CheckerWorkflowStore, private query: SessionQuery) {
    super(store);
  }

  /**
   * Determines if a given entry is a workflow or not (tool).
   * Returns true if entry is a workflow, returns false if entry is not a workflow (i.e. a tool)
   * @param entry The entry to check
   */
  public isEntryAWorkflow(entry: Entry | null): boolean | null {
    if (!entry) {
      return null;
    }
    return entry.hasOwnProperty('is_checker');
  }

  /**
   * Determine the TRS ID (ex. #workflow/github.com/dockstore/hello_world) based on the entry
   *
   * @param {(Entry | null)} entry  Either a DockstoreTool or Workflow
   * @returns {(string | null)}  The TRS ID (ex. #workflow/github.com/dockstore/hello_world)
   * @memberof CheckerWorkflowQuery
   */
  public getTRSId(entry: Entry | null): string | null {
    const entryIsWorkflow = this.isEntryAWorkflow(entry);
    if (entryIsWorkflow == null) {
      return null;
    }
    if (entryIsWorkflow) {
      return ga4ghWorkflowIdPrefix + (<Workflow>entry).full_workflow_path;
    } else {
      return (<DockstoreTool>entry).tool_path;
    }
  }
}
