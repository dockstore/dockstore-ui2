/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { transaction } from '@datorama/akita';
import { combineLatest, merge as observableMerge, Observable } from 'rxjs';
import { distinctUntilChanged, filter, first, map, takeUntil } from 'rxjs/operators';

import { Base } from '../base';
import { SessionQuery } from '../session/session.query';
import { ContainersService } from '../swagger/api/containers.service';
import { WorkflowsService } from '../swagger/api/workflows.service';
import { DockstoreTool } from '../swagger/model/dockstoreTool';
import { Entry } from '../swagger/model/entry';
import { Workflow } from '../swagger/model/workflow';
import { ToolQuery } from '../tool/tool.query';
import { CheckerWorkflowQuery } from './checker-workflow.query';
import { CheckerWorkflowStore } from './checker-workflow.store';
import { WorkflowQuery } from './workflow.query';
import { includesValidation } from '../constants';

@Injectable({ providedIn: 'root' })
export class CheckerWorkflowService extends Base {
  // The current public page status
  private publicPage: boolean;
  constructor(private workflowsService: WorkflowsService, private sessionQuery: SessionQuery, private workflowQuery: WorkflowQuery,
    private router: Router, private containersService: ContainersService,
    private toolQuery: ToolQuery, private checkerWorkflowStore: CheckerWorkflowStore, private checkerWorkflowQuery: CheckerWorkflowQuery) {
    super();
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((publicPage: boolean) => this.publicPage = publicPage);
    observableMerge(this.toolQuery.tool$, this.workflowQuery.workflow$).pipe(
      filter(x => x != null),
      distinctUntilChanged(),
      takeUntil(this.ngUnsubscribe)).subscribe((entry: Entry) =>
      this.setEntryAndChecker(entry));
  }

  @transaction()
  public setEntryAndChecker(entry: Entry) {
    const checker_id = entry.checker_id;
    if (checker_id)  {
      this.updateCheckerWorkflow(checker_id, this.publicPage, entry);
    } else {
      this.setState(null, entry);
    }
  }

  public getCheckerWorkflowURLObservable(checkerWorkflow$: Observable<Workflow>, isPublic$: Observable<boolean>): Observable<string> {
  return combineLatest(
    checkerWorkflow$,
    isPublic$).pipe(
      map(([workflow, isPublic]) => workflow ? this.getCheckerWorkflowURL(workflow, isPublic) : null));
    }

  public canAdd(checkerId$: Observable<number>, parentId$: Observable<number>, isStub$: Observable<boolean>): Observable<boolean> {
    return combineLatest(checkerId$, parentId$, isStub$).pipe(map(([checkerId, parentId, isStub]) => {
      return !checkerId && !parentId && !isStub;
    }));
  }

  public updateCheckerWorkflow(id: number, isPublic: boolean, entry) {
    // This sets the checker-workflow.checkerWorkflow state
    if (isPublic) {
      this.workflowsService.getPublishedWorkflow(id, includesValidation).pipe(first()).subscribe((workflow: Workflow) => {
        this.setState(workflow, entry);
      }, error => this.setState(null, entry));
    } else {
      this.workflowsService.getWorkflow(id).pipe(first()).subscribe((workflow: Workflow) => {
        this.setState(workflow, entry);
      }, error => this.setState(null, entry));
    }
  }

  public setState(checkerWorkflow: Workflow, entry: Entry) {
    this.checkerWorkflowStore.setState(state => {
      return {
        entry: entry,
        checkerWorkflow: checkerWorkflow
      };
    });
  }



  public getCheckerWorkflowURL(workflow: Workflow, isPublic: boolean): string {
    if (workflow) {
      return this.getEntryURL(isPublic, workflow.full_workflow_path, 'workflow');
    } else {
      console.log('This entry has no checker workflow.');
    }
  }

  /**
   * Go to parent entry (could be a tool or workflow)
   */
  public goToParentEntry(): void {
    const parentId = (<Workflow>this.checkerWorkflowQuery.getSnapshot().entry).parent_id;
    if (!parentId) {
      console.log('This entry is not a checker workflow and has no parent entry.');
      return;
    }
    if (this.publicPage) {
      this.workflowsService.getPublishedWorkflow(parentId).subscribe((workflow: Workflow) => {
        this.goToEntry(this.publicPage, workflow.full_workflow_path, 'workflow');
      }, error => this.containersService.getPublishedContainer(parentId).subscribe((tool: DockstoreTool) => {
        this.goToEntry(this.publicPage, tool.tool_path, 'tool');
      }, error2 => console.log('Can not get parent entry')));
    } else {
      this.workflowsService.getWorkflow(parentId).subscribe((workflow: Workflow) => {
        this.goToEntry(this.publicPage, workflow.full_workflow_path, 'workflow');
      }, error => this.containersService.getContainer(parentId).subscribe((tool: DockstoreTool) => {
        this.goToEntry(this.publicPage, tool.tool_path, 'tool');
      }, error2 => console.log('Can not get parent entry')));
    }
  }

  /**
   * Go to entry
   * @param path Full path of entry
   * @param entryType Either 'tool' or 'workflow'
   */
  public goToEntry(publicPage: boolean, path: string, entryType: 'tool' | 'workflow'): void {
    this.router.navigateByUrl(this.getEntryURL(publicPage, path, entryType));
  }

  /**
   * Get the entry's URL
   *
   * @param {boolean} publicPage    Whether the user is currently on a public page or not
   * @param {string} path           The entry path
   * @param {('tool' | 'workflow')} entryType  Whether entry is a tool or workflow
   * @returns {string}              The URL of the entry
   * @memberof CheckerWorkflowService
   */
  public getEntryURL(publicPage: boolean, path: string, entryType: 'tool' | 'workflow'): string {
    let url: string;
    if (publicPage) {
      url = '/' + entryType + 's/' + path;
    } else {
      url = '/my-' + entryType + 's/' + path;
    }
    return url;
  }
}
