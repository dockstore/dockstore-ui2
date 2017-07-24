import { StateService } from './../../shared/state.service';
import { Workflow } from './../../shared/swagger/model/workflow';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowService } from './../../shared/workflow.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class InfoTabService {
    public workflowPathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public defaultTestFilePathEditing$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    private workflows: Workflow[];
    private workflow: Workflow;

    constructor(private workflowsService: WorkflowsService, private workflowService: WorkflowService, private stateService: StateService) {
        this.workflowService.workflow$.subscribe(workflow => this.workflow = workflow);
        this.workflowService.workflows$.subscribe(workflows => this.workflows = workflows);
    }
    setWorkflowPathEditing(editing: boolean) {
        this.workflowPathEditing$.next(editing);
    }

    setDefaultTestFilePathEditing(editing: boolean) {
        this.defaultTestFilePathEditing$.next(editing);
    }

    updateAndRefresh(workflow: Workflow) {
        this.workflowsService.updateWorkflow(this.workflow.id, workflow).subscribe(response => {
            this.stateService.setRefreshing(true);
            this.workflowsService.refresh(this.workflow.id).subscribe(refreshResponse => {
                this.workflowService.replaceWorkflow(this.workflows, refreshResponse);
                this.workflowService.setWorkflow(refreshResponse);
                this.stateService.setRefreshing(false);
            });
        });
    }
}
