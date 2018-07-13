/*
 *    Copyright 2017 OICR
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
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Workflow } from './swagger/model/workflow';

@Injectable()
export class WorkflowService {
  private workflowSource = new BehaviorSubject<any>(null);
  // Observable streams
  workflow$ = this.workflowSource.asObservable(); // This is the selected workflow
  workflowId$: Observable<number>;
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows
  sharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted shared workflows
  nsSharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted shared workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  workflowIsPublished$: Observable<boolean>;
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor() {
    this.workflowId$ = this.workflow$.pipe(map((workflow: Workflow) => {
      if (workflow) {
        return workflow.id;
      } else {
        return null;
      }
    }));
    this.workflowIsPublished$ = this.workflow$.pipe(map((workflow: Workflow) => {
      if (workflow) {
        return workflow.is_published;
      } else {
        return null;
      }
    }));
  }
  setWorkflow(workflow: Workflow) {
    this.workflowSource.next(workflow);
  }

  setWorkflows(workflows: Array<Workflow>) {
    this.workflows$.next(workflows);
  }

  setSharedWorkflows(workflows: Array<any>) {
    this.sharedWorkflows$.next(this.convertSharedWorkflowsToWorkflowsList(workflows));
  }

  /**
   * Converts the mapping of roles to workflows to a concatentation of all the workflows
   * @param workflows mapping returned by shared workflows endpoint
   */
  convertSharedWorkflowsToWorkflowsList(workflows: Array<any>): Array<Workflow> {
    if (workflows) {
      let sharedWorkflows = workflows.map(workflow => workflow.workflows);
      sharedWorkflows = [].concat.apply([], sharedWorkflows);
      return sharedWorkflows;
    } else {
      return null;
    }
  }

  /**
   * Upsert the new workflow into the current list of workflows (depends on the workflow id)
   * If not found will add to the workflows list (not shared workflows)
   * @param workflow Workflow to be upserted
   */
  upsertWorkflowToWorkflow(workflow: Workflow) {
    const workflows = this.workflows$.getValue();
    const sharedWorkflows = this.sharedWorkflows$.getValue();
    if (workflow && workflows && sharedWorkflows) {
      const oldWorkflow = workflows.find(x => x.id === workflow.id);
      const oldSharedWorkflow = sharedWorkflows.find(x => x.id === workflow.id);
      if (oldWorkflow) {
        const index = workflows.indexOf(oldWorkflow);
        workflows[index] = workflow;
        this.setWorkflows(workflows);
      } else if (oldSharedWorkflow) {
        const index = workflows.indexOf(oldWorkflow);
        sharedWorkflows[index] = workflow;
        this.setSharedWorkflows(sharedWorkflows);
      } else {
        workflows.push(workflow);
        this.setWorkflows(workflows);
      }
    }
  }

  setNsWorkflows(nsWorkflows: any) {
    this.nsWorkflows$.next(nsWorkflows);
  }

  setNsSharedWorkflows(nsWorkflows: any) {
    this.nsSharedWorkflows$.next(nsWorkflows);
  }

  setCopyBtn(copyBtn: any) {
    this.copyBtnSource.next(copyBtn);
  }

}
