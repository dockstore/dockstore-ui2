import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { StateService } from './state.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { Workflow } from './swagger/model/workflow';

@Injectable()
export class CheckerWorkflowService {
    // The checker workflow's path
    checkerWorkflowPath$: Observable<string>;
    checkerWorkflow$ = new BehaviorSubject<Workflow>(null);
    publicPage: boolean;
    constructor(private workflowsService: WorkflowsService, private stateService: StateService) {
        this.stateService.publicPage$.subscribe(publicPage => this.publicPage = publicPage);
        this.checkerWorkflowPath$ = this.checkerWorkflow$.map((workflow: Workflow) => {
            if (workflow) {
                return workflow.path;
            } else {
                return null;
            }
        });
    }

    /**
     * Updates the checkerWorkflowPath$ observable to contain the path of the workflow
     * @param id The workflow id of the checker workflow
     */
    getCheckerWorkflowPath(id: number): void {
        if (id) {
            if (this.publicPage) {
                this.workflowsService.getPublishedWorkflow(id).subscribe((workflow: Workflow) => {
                    this.checkerWorkflow$.next(workflow);
                });
            } else {
                // TODO: Convert this from subscribe to map and convert checkerWorkflowPath$ from BehaviorSubject to Observable
                this.workflowsService.getWorkflow(id).subscribe((workflow: Workflow) => {
                    this.checkerWorkflow$.next(workflow);
                });
            }
        }
    }
}
