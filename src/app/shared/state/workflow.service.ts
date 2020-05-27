import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { BehaviorSubject } from 'rxjs';
import { Workflow, WorkflowVersion } from '../swagger';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';
import { ExtendedWorkflowService } from './extended-workflow.service';
import { WorkflowStore } from './workflow.store';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  workflows$: BehaviorSubject<any> = new BehaviorSubject(null); // This contains the list of unsorted workflows
  sharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject(null); // This contains the list of unsorted shared workflows
  nsSharedWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted shared workflows
  nsWorkflows$: BehaviorSubject<any> = new BehaviorSubject<any>(null); // This contains the list of sorted workflows
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor(private workflowStore: WorkflowStore, private extendedWorkflowService: ExtendedWorkflowService) {}

  /**
   * Converts the mapping of roles to workflows to a concatentation of all the workflows
   * @param workflows mapping returned by shared workflows endpoint
   */
  static convertSharedWorkflowsToWorkflowsList(workflows: Array<any>): Array<Workflow> {
    if (workflows) {
      let sharedWorkflows = workflows.map(workflow => workflow.workflows);
      sharedWorkflows = [].concat.apply([], sharedWorkflows);
      return sharedWorkflows;
    } else {
      return null;
    }
  }

  @transaction()
  setWorkflow(workflow: BioWorkflow | Service | null) {
    if (workflow) {
      this.workflowStore.upsert(workflow.id, workflow);
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

  clearVersion() {
    this.workflowStore.update({ version: null });
  }

  add(workflow: Service | BioWorkflow) {
    this.workflowStore.add(workflow);
  }

  update(id, workflow: Partial<Service | BioWorkflow>) {
    this.workflowStore.update(id, workflow);
  }

  remove(id: ID) {
    this.workflowStore.remove(id);
  }

  setWorkflows(workflows: BioWorkflow[] | Service[]) {
    this.workflows$.next(workflows);
  }

  setWorkflowVersion(version: WorkflowVersion) {
    this.workflowStore.update({ version: version });
  }

  setSharedWorkflows(workflows: Array<any>) {
    this.sharedWorkflows$.next(WorkflowService.convertSharedWorkflowsToWorkflowsList(workflows));
  }

  /**
   * Upsert the new workflow into the current list of workflows (depends on the workflow id)
   * If not found will add to the workflows list (not shared workflows)
   * @param workflow Workflow to be upserted
   */
  upsertWorkflowToWorkflow(workflow: BioWorkflow | Service) {
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

  /**
   * Updates an existing workflow by updating the current list of workflows
   * and updating extendededWorkfllowService
   * @param workflow the workflow to be updated
   */
  updateWorkflow(workflow: BioWorkflow | Service) {
    this.upsertWorkflowToWorkflow(workflow);
    this.extendedWorkflowService.update(workflow);
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
