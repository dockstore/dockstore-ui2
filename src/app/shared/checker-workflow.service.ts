import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/distinctUntilChanged';

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ContainerService } from './container.service';
import { StateService } from './state.service';
import { ContainersService } from './swagger/api/containers.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { DockstoreTool } from './swagger/model/dockstoreTool';
import { Entry } from './swagger/model/entry';
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
    // The current public page status
    private publicPage: boolean;
    // The current checkerWorkflowPath
    private checkerWorkflowPath: string;
    // The current checker workflow
    private checkerWorkflow: Workflow;
    // The tool's parent id
    private toolParentId$: Observable<number>;
    // The workflow's parent id
    private workflowParentId$: Observable<number>;
    // The parent workflow id if the tool/workflow has a parent workflow
    private parentId$: Observable<number>;
    // The current parent workflow path
    private parentWorkflowPath: string;
    // The current parent workflow
    private parentEntry: Entry;
    // The parent workflow if it exists
    public parentEntry$ = new BehaviorSubject<Entry>(null);
    // The parent workflow's path (ex. 'github.com/A/l')
    public parentWorkflowPath$: Observable<string>;
    // The current entry being looked at
    public entry$: Observable<Entry>;
    // Whether the parent is a workflow or not
    public isParentAWorkflow: boolean;
    // Whether the current entry has a parent or not
    public hasParentEntry$: Observable<boolean>;
    constructor(private workflowsService: WorkflowsService, private stateService: StateService, private workflowService: WorkflowService,
        private containerService: ContainerService, private router: Router, private containersService: ContainersService) {
        this.publicPage$ = this.stateService.publicPage$;
        this.stateService.publicPage$.subscribe((publicPage: boolean) => this.publicPage = publicPage);
        this.toolCheckerId$ = this.containerService.toolCheckerId$;
        this.workflowCheckerId$ = this.workflowService.workflowCheckerId$;
        this.toolParentId$ = this.containerService.parentId$;
        this.workflowParentId$ = this.workflowService.parentId$;
        this.entry$ = Observable.merge(this.containerService.tool$, this.workflowService.workflow$)
            .filter(x => x != null).distinctUntilChanged();
        this.hasParentEntry$ = this.entry$.map((entry: Entry) => {
            if (entry.hasOwnProperty('is_checker')) {
                if ((<Workflow>entry).parent_id) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        });
        this.checkerWorkflowID$ = this.entry$.map((entry: Entry) => {
            if (entry.checker_id) {
                return entry.checker_id.id;
            } else {
                return null;
            }
        }).distinctUntilChanged();
        // The filters are needed by in my-tools, the workflow service exists and it emits after the tool service which overrides it
        this.parentId$ = this.entry$.map((entry: Entry) => {
            if (entry.hasOwnProperty('is_checker')) {
                return (<Workflow>entry).parent_id;
            } else {
                return null;
            }
        });
        this.parentEntry$.subscribe((entry: Entry) => {
            if (!entry) {
                return null;
            }
            if (entry.hasOwnProperty('is_checker')) {
                this.isParentAWorkflow = true;
            } else {
                this.isParentAWorkflow = false;
            }
        });
        this.checkerWorkflowPath$ = this.checkerWorkflow$.map((workflow: Workflow) => {
            if (workflow) {
                this.checkerWorkflow = workflow;
                return workflow.full_workflow_path;
            } else {
                return null;
            }
        });
        this.parentWorkflowPath$ = this.parentEntry$.map((workflow: Workflow) => {
            if (workflow) {
                this.parentEntry = workflow;
                return workflow.full_workflow_path;
            } else {
                return null;
            }
        });
        this.checkerWorkflowPath$.subscribe((checkerWorkflowPath: string) => this.checkerWorkflowPath = checkerWorkflowPath);
        this.parentWorkflowPath$.subscribe((workflowPath: string) => this.parentWorkflowPath = workflowPath);
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
        Observable.combineLatest(this.checkerWorkflowID$, this.publicPage$).subscribe((value) => {
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
                        if (this.router.url.includes('workflows')) {
                            this.workflowService.upsertWorkflowToWorkflow(workflow);
                        }
                    }, error => this.checkerWorkflow$.next(null));
                }
            } else {
                this.checkerWorkflow$.next(null);
            }
        });

        Observable.combineLatest(this.parentId$, this.publicPage$).subscribe((value) => {
            const id = value[0];
            const publicPage = value[1];
            if (id) {
                // TODO: Figure out a cleaner way to do this if statement observable thing
                if (publicPage) {
                    this.workflowsService.getPublishedWorkflow(id).subscribe((workflow: Workflow) => {
                        this.parentEntry$.next(workflow);
                    }, error => this.containersService.getPublishedContainer(id).subscribe((tool: DockstoreTool) => {
                        this.parentEntry$.next(tool);
                    }, error2 => this.parentEntry$.next(null)));
                } else {
                    this.workflowsService.getWorkflow(id).subscribe((workflow: Workflow) => {
                        this.parentEntry$.next(workflow);
                    }, error => this.containersService.getContainer(id).subscribe((tool: DockstoreTool) => {
                        this.parentEntry$.next(tool);
                    }, error2 => this.parentEntry$.next(null)));
                }
            } else {
                this.parentEntry$.next(null);
            }
        });
    }

    /**
     * Go to checker workflow
     */
    public goToCheckerWorkflow(): void {
        this.goToEntry(this.publicPage, this.checkerWorkflow.full_workflow_path, 'workflow');
    }

    /**
     * Go to parent entry (could be a tool or workflow)
     */
    public goToParentEntry(): void {
        if (this.isParentAWorkflow) {
            this.goToEntry(this.publicPage, (<Workflow>this.parentEntry).full_workflow_path, 'workflow');
        } else {
            this.goToEntry(this.publicPage, (<DockstoreTool>this.parentEntry).tool_path, 'tool');
        }
    }

    /**
     * Go to entry
     * @param path Full path of entry
     * @param entryType Either 'tool' or 'workflow'
     */
    public goToEntry(publicPage: boolean, path: string, entryType: 'tool' | 'workflow'): void {
        let url: string;
        if (publicPage) {
            url = '/' + entryType + 's/' + path;
        } else {
            url = '/my-' + entryType + 's/' + path;
        }
        this.router.navigateByUrl(url);
    }
}
