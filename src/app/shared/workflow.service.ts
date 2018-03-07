/**
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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { Workflow } from './swagger/model/workflow';

@Injectable()
export class WorkflowService {
  private workflowSource = new BehaviorSubject<any>(null);
  // Observable streams
  workflow$ = this.workflowSource.asObservable(); // This is the selected workflow
  workflowId$: Observable<number>
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor() {
    this.workflowId$ = this.workflow$.map((workflow: Workflow) => {
      if (workflow) {
        return workflow.id;
      } else {
        return null;
      }
    });
  }
  setWorkflow(workflow: any) {
    this.workflowSource.next(workflow);
  }

  setWorkflows(workflows: any) {
    this.workflows$.next(workflows);
  }

  /**
   * Upsert the new workflow into the current list of workflows (depends on the workflow id)
   * @param workflow Workflow to be upserted
   */
  upsertWorkflowToWorkflow(workflow: Workflow) {
    const workflows = this.workflows$.getValue();
    if (!workflow || !workflows) {
      return;
    }
    const oldWorkflow = workflows.find(x => x.id === workflow.id);
    if (oldWorkflow) {
      const index = workflows.indexOf(oldWorkflow);
      workflows[index] = workflow;
    } else {
      workflows.push(workflow);
    }
    this.setWorkflows(workflows);
  }

  /**
   * This function replaces the workflow inside of workflows with an updated workflow
   *
   * @param {*} workflows the current set of workflows
   * @param {*} newWorkflow the new workflow we are replacing
   * @memberof WorkflowService
   */
  replaceWorkflow(workflows: Workflow[], newWorkflow: Workflow) {
    workflows = this.workflows$.getValue();
    const oldTool = workflows.find(x => x.id === newWorkflow.id);
    const index = workflows.indexOf(oldTool);
    workflows[index] = newWorkflow;
    this.setWorkflows(workflows);
  }

  setNsWorkflows(nsWorkflows: any) {
    this.nsWorkflows$.next(nsWorkflows);
  }
  setCopyBtn(copyBtn: any) {
    this.copyBtnSource.next(copyBtn);
  }

}
