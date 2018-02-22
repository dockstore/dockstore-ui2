import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { WorkflowsService } from './swagger/api/workflows.service';
import { Workflow } from './swagger/model/workflow';

@Injectable()
export class CheckerWorkflowService {
    // The checker workflow's path
    checkerWorkflowPath$ = new BehaviorSubject<string>('');
    checkerWorkflowVersionName$ = new BehaviorSubject<string>('');
    constructor(private workflowsService: WorkflowsService) { }

    /**
     * Updates the checkerWorkflowPath$ observable to contain the path of the workflow
     * @param id The workflow id of the checker workflow
     */
    getCheckerWorkflowPath(id: number): void {
        if (id) {
            // TODO: Convert this from subscribe to map and convert checkerWorkflowPath$ from BehaviorSubject to Observable
            this.workflowsService.getPublishedWorkflow(id).subscribe((workflow: Workflow) => {
                this.checkerWorkflowPath$.next(workflow.path);
            }, error => {
                this.clearCheckWorkflowPath();
            });
        } else {
            this.clearCheckWorkflowPath();
        }
    }

    private clearCheckWorkflowPath(): void {
        this.checkerWorkflowPath$.next('');
    }
}
