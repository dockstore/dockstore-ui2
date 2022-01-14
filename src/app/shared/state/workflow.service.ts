import { Injectable } from '@angular/core';
import { ID, transaction } from '@datorama/akita';
import { BehaviorSubject } from 'rxjs';
import { AppTool, Workflow, WorkflowVersion } from '../swagger';
import { BioWorkflow } from '../swagger/model/bioWorkflow';
import { Service } from '../swagger/model/service';
import { ExtendedWorkflowService } from './extended-workflow.service';
import { WorkflowQuery } from './workflow.query';
import { WorkflowStore } from './workflow.store';

@Injectable({ providedIn: 'root' })
export class WorkflowService {
  // This contains the list of unsorted workflows
  workflows$: BehaviorSubject<Array<Workflow>> = new BehaviorSubject(null);
  // This contains the list of unsorted shared workflows
  sharedWorkflows$: BehaviorSubject<Array<Workflow>> = new BehaviorSubject(null);
  // This contains the list of sorted shared workflows
  nsSharedWorkflows$: BehaviorSubject<Array<Workflow>> = new BehaviorSubject<Array<Workflow>>(null);
  // This contains the list of sorted workflows
  nsWorkflows$: BehaviorSubject<Array<Workflow>> = new BehaviorSubject<Array<Workflow>>(null);
  private copyBtnSource = new BehaviorSubject<any>(null); // This is the currently selected copy button.
  copyBtn$ = this.copyBtnSource.asObservable();
  constructor(
    private workflowStore: WorkflowStore,
    private extendedWorkflowService: ExtendedWorkflowService,
    private workflowQuery: WorkflowQuery
  ) {}

  /**
   * Converts the mapping of roles to workflows to a concatentation of all the workflows
   * @param workflows mapping returned by shared workflows endpoint
   */
  static convertSharedWorkflowsToWorkflowsList(workflows: Array<any>): Array<Workflow> {
    if (workflows) {
      let sharedWorkflows = workflows.map((workflow) => workflow.workflows);
      sharedWorkflows = [].concat.apply([], sharedWorkflows);
      return sharedWorkflows;
    } else {
      return null;
    }
  }

  @transaction()
  setWorkflow(workflow: BioWorkflow | Service | AppTool | null) {
    if (workflow) {
      this.workflowStore.upsert(workflow.id, workflow);
      this.extendedWorkflowService.update(workflow);
      this.workflowStore.setActive(workflow.id);
    } else {
      this.workflowStore.remove();
      this.extendedWorkflowService.remove();
    }
  }

  updateActiveTopic(topic: string) {
    const newWorkflow = { ...this.workflowQuery.getActive(), topicManual: topic };
    this.workflowStore.upsert(newWorkflow.id, newWorkflow);
    this.extendedWorkflowService.update(newWorkflow);
  }

  updateActiveTopicSelection(topicSelection: Workflow.TopicSelectionEnum) {
    const newWorkflow = { ...this.workflowQuery.getActive(), topicSelection: topicSelection };
    this.workflowStore.upsert(newWorkflow.id, newWorkflow);
    this.extendedWorkflowService.update(newWorkflow);
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

  update(id: ID, workflow: Partial<Service | BioWorkflow>) {
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
      const oldWorkflow = workflows.find((x) => x.id === workflow.id);
      const oldSharedWorkflow = sharedWorkflows.find((x) => x.id === workflow.id);
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
