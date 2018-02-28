import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/distinctUntilChanged';

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ContainerService } from './container.service';
import { StateService } from './state.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { Workflow } from './swagger/model/workflow';
import { WorkflowService } from './workflow.service';

@Injectable()
export class CheckerWorkflowService {
    // The checker workflow's path (ex. 'github.com/A/l')
    public checkerWorkflowPath$: Observable<string>;
    // The checker workflow's default workflow path (ex. '/Dockstore.cwl')
    public checkerWorkflowDefaultWorkflowPath$: Observable<string>;
    // The checker workflow if it exists
    public checkerWorkflow$ = new BehaviorSubject<Workflow>(null);
    // Whether there is a checker workflow or not
    public hasChecker$: Observable<boolean>;
    // Whether we're on a public page or not (my-tools/my-workflows)
    public publicPage$: Observable<boolean>;
    // The checker workflow id if the tool/workflow has a checker workflow
    public checkerWorkflowID$: Observable<number>;
    // Last workflow's id that was looked at
    private workflowCheckerId$: Observable<number>;
    // Last tool's id that was looked at
    private toolCheckerId$: Observable<number>;
    constructor(private workflowsService: WorkflowsService, private stateService: StateService, private workflowService: WorkflowService,
        private containerService: ContainerService) {
        this.publicPage$ = this.stateService.publicPage$;
        this.toolCheckerId$ = this.containerService.toolCheckerId$;
        this.workflowCheckerId$ = this.workflowService.workflowCheckerId$;
        this.checkerWorkflowID$ = Observable.merge(this.toolCheckerId$, this.workflowCheckerId$).distinctUntilChanged();
        this.checkerWorkflowPath$ = this.checkerWorkflow$.map((workflow: Workflow) => {
            if (workflow) {
                return workflow.path;
            } else {
                return null;
            }
        });
        this.checkerWorkflowDefaultWorkflowPath$ = this.checkerWorkflow$.map((workflow: Workflow) => {
            if (workflow) {
                return workflow.workflow_path;
            } else {
                return null;
            }
        });
        this.hasChecker$ = this.checkerWorkflow$.map((workflow: Workflow) => {
            // TODO: simplify this
            if (workflow) {
                return true;
            } else {
                return false;
            }
        });

        Observable.combineLatest(this.checkerWorkflowID$, this.publicPage$).distinctUntilChanged().subscribe((value) => {
            const id = value[0];
            const publicPage = value[1];
            if (id) {
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
            }
        });
    }

    /**
     * Update the checker workflow's default workflow path, adds it if it previously didn't exist
     */
    public save(path: string): void {
        // Placeholder for endpoint that modifies the checker workflow's default workflow path
        console.log('saving');
    }
}
