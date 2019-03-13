import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { BehaviorSubject } from 'rxjs';
import { Workflow } from '../swagger';
import { ExtendedWorkflowService } from './extended-workflow.service';
import { WorkflowStore } from './workflow.store';


@Injectable({ providedIn: 'root' })
export class WorkflowService {
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted workflows
  sharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject(null);  // This contains the list of unsorted shared workflows
  nsSharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted shared workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor(private workflowStore: WorkflowStore, private extendedWorkflowService: ExtendedWorkflowService) {
  }

  @transaction()
  setWorkflow(workflow: (Workflow | null)) {
    if (workflow) {
      this.workflowStore.createOrReplace(workflow.id, workflow);
      this.extendedWorkflowService.update(workflow);
      this.workflowStore.setActive(workflow.id);
    } else {
      this.workflowStore.remove();
      this.extendedWorkflowService.remove();
    }
  }

  get() {
    // Placeholder
    // this.http.get('https://akita.com').subscribe((entities) => this.workflowStore.set(entities));
  }

  clearActive() {
    this.workflowStore.setActive(null);
  }

  add(workflow: Workflow) {
    this.workflowStore.add(workflow);
  }

  update(id, workflow: Partial<Workflow>) {
    this.workflowStore.update(id, workflow);
  }

  remove(id: ID) {
    this.workflowStore.remove(id);
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
