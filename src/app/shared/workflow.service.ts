import { Workflow } from './swagger/model/workflow';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

import { Dockstore } from './dockstore.model';
@Injectable()
export class WorkflowService {
  private workflowSource = new BehaviorSubject<any>(null);
  // Observable streams
  workflow$ = this.workflowSource.asObservable(); // This is the selected workflow
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor() {}
  setWorkflow(workflow: any) {
    this.workflowSource.next(workflow);
  }

  setWorkflows(workflows: any) {
    this.workflows$.next(workflows);
  }

  /**
   * This function replaces the workflow inside of workflows with an updated workflow
   *
   * @param {*} workflows the current set of workflows
   * @param {*} newWorkflow the new workflow we are replacing
   * @memberof WorkflowService
   */
  replaceWorkflow(workflows: Workflow[], newWorkflow: Workflow) {
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
