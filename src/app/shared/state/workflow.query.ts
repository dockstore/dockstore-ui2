import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { WorkflowStore, WorkflowState } from './workflow.store';
import { Workflow } from '../swagger';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WorkflowQuery extends QueryEntity<WorkflowState, Workflow> {
  public workflow$: Observable<Workflow> = this.selectActive();
  public workflowId$: Observable<number> = this.workflow$.pipe(map((workflow: Workflow) => workflow ? workflow.id : null));
  public workflowIsPublished$: Observable<boolean> = this.workflow$.pipe(
    map((workflow: Workflow) => workflow ? workflow.is_published : null));
  constructor(protected store: WorkflowStore) {
    super(store);
  }

}
