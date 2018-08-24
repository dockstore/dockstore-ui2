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
import { BehaviorSubject, merge as observableMerge, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, first, map, takeUntil } from 'rxjs/operators';

import { ContainerService } from './container.service';
import { StateService } from './state.service';
import { ContainersService } from './swagger/api/containers.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Entry } from './swagger/model/entry';
import { Workflow } from './swagger/model/workflow';
import { WorkflowService } from './workflow.service';

@Injectable()
export class CheckerWorkflowService {
  // The checker workflow's path (ex. 'github.com/A/l')
  public checkerWorkflowPath$: Observable<string>;
  // The checker workflow if it exists
  public checkerWorkflow$ = new BehaviorSubject<Workflow>(null);
  // Whether we're on a public page or not (my-tools/my-workflows)
  public publicPage$: Observable<boolean>;
  // The current public page status
  private publicPage: boolean;
  // The current checker workflow
  private checkerWorkflow: Workflow;
  public entry$: Observable<Entry>;
  private entrySource$: BehaviorSubject<Entry> = new BehaviorSubject<Entry>(null);
  // Whether the current entry has a parent or not
  public hasParentEntry: boolean;
  public parentId: number;
  public entry: Entry;
  // Whether current entry is a stub or not
  public isStub$: Observable<boolean>;
  private ngUnsubscribe: Subject<{}> = new Subject();
  constructor(private workflowsService: WorkflowsService, private stateService: StateService, private workflowService: WorkflowService,
    private containerService: ContainerService, private router: Router, private containersService: ContainersService) {
    this.publicPage$ = this.stateService.publicPage$;
    this.publicPage$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((publicPage: boolean) => this.publicPage = publicPage);
    observableMerge(this.containerService.tool$, this.workflowService.workflow$).pipe(
      filter(x => x != null),
      distinctUntilChanged()).subscribe((entry: Entry) => {
        this.entrySource$.next(entry);
      });
    this.entry$ = this.entrySource$;
    this.checkerWorkflowPath$ = this.checkerWorkflow$.pipe(map((workflow: Workflow) => {
      if (workflow) {
        return workflow.full_workflow_path;
      } else {
        return null;
      }
    }));
    this.checkerWorkflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Workflow) => {
      this.checkerWorkflow = workflow;
    });
    this.isStub$ = this.entry$.pipe(map((entry: Entry) => {
      if (!this.isEntryAWorkflow(entry)) {
        return false;
      } else {
        return (<Workflow>entry).mode === Workflow.ModeEnum.STUB;
      }
    }));
    this.entry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((entry: Entry) => {
      this.entry = entry;
      this.parentId = ((<Workflow>entry).parent_id);
      if (!entry || !entry.checker_id) {
        this.checkerWorkflow$.next(null);
        return;
      }
      const id = entry.checker_id;
      const publicPage = this.publicPage;

      // TODO: Figure out a cleaner way to do this if statement observable thing
      if (publicPage) {
        this.workflowsService.getPublishedWorkflow(id).subscribe((workflow: Workflow) => {
          this.checkerWorkflow$.next(workflow);
        }, error => this.checkerWorkflow$.next(null));
      } else {
        this.workflowsService.getWorkflow(id).subscribe((workflow: Workflow) => {
          this.checkerWorkflow$.next(workflow);
        }, error => this.checkerWorkflow$.next(null));
      }
    });
  }

  /**
   * Go to checker workflow
   */
  public goToCheckerWorkflow(): void {
    const workflow = this.checkerWorkflow;
    if (workflow) {
      this.goToEntry(this.publicPage, workflow.full_workflow_path, 'workflow');
    } else {
      console.log('This entry has no checker workflow.');
    }
  }

  public getCheckerWorkflowURL(): string {
    const workflow = this.checkerWorkflow;
    if (workflow) {
      return this.getEntryURL(this.publicPage, workflow.full_workflow_path, 'workflow');
    } else {
      console.log('This entry has no checker workflow.');
    }
  }

  /**
   * Go to parent entry (could be a tool or workflow)
   */
  public goToParentEntry(): void {
    const parentId = (<Workflow>this.entry).parent_id;
    if (!parentId) {
      console.log('This entry is not a checker workflow and has no parent entry.');
      return;
    }
    if (this.publicPage) {
      this.workflowsService.getPublishedWorkflow(parentId).pipe(first()).subscribe((workflow: Workflow) => {
        this.goToEntry(this.publicPage, workflow.full_workflow_path, 'workflow');
      }, error => this.containersService.getPublishedContainer(parentId).pipe(first()).subscribe((tool: DockstoreTool) => {
        this.goToEntry(this.publicPage, tool.tool_path, 'tool');
      }, error2 => console.log('Can not get parent entry')));
    } else {
      this.workflowsService.getWorkflow(parentId).pipe(first()).subscribe((workflow: Workflow) => {
        this.goToEntry(this.publicPage, workflow.full_workflow_path, 'workflow');
      }, error => this.containersService.getContainer(parentId).pipe(first()).subscribe((tool: DockstoreTool) => {
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

  /**
   * Determines if a given entry is a workflow or not (tool).
   * Returns true if entry is a workflow, returns false if entry is not a workflow (i.e. a tool)
   * @param entry The entry to check
   */
  public isEntryAWorkflow(entry: Entry): boolean {
    if (!entry) {
      return null;
    }
    return entry.hasOwnProperty('is_checker');
  }
}
