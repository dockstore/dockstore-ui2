import { Workflow } from './../../swagger/model/workflow';
import { RefreshService } from './../../refresh.service';
import { Entry } from './../../swagger/model/entry';
import { WorkflowService } from './../../workflow.service';
import { ContainerService } from './../../container.service';
import { WorkflowsService } from './../../swagger/api/workflows.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

import { ErrorService } from './../../error.service';
import { StateService } from './../../state.service';

@Injectable()
export class RegisterCheckerWorkflowService {

    public isModalShown$ = new BehaviorSubject<boolean>(false);
    public refreshMessage$ = new BehaviorSubject<string>(null);
    public mode$ = new BehaviorSubject<'add' | 'edit'>('edit');
    public errorObj$: Observable<any>;
    public entryId$: Observable<number>;
    public entryId: number;
    constructor(private stateService: StateService, private errorService: ErrorService, private workflowsService: WorkflowsService,
        private containerService: ContainerService, private workflowService: WorkflowService, private refreshService: RefreshService) {
        this.refreshMessage$ = this.stateService.refreshMessage$;
        this.errorObj$ = this.errorService.errorObj$;
        this.entryId$ = Observable.merge(this.containerService.toolId$, this.workflowService.workflowId$).filter(x => x != null);
        this.entryId$.subscribe((id: number) => {
            this.entryId = id;
        });
    }

    registerCheckerWorkflow(workflowPath: string, descriptorType: string, testParameterFilePath: string): void {
        if (this.entryId) {
            const message = 'Regstering checker workflow';
            this.stateService.setRefreshMessage(message);
            // Figure out why testParameterFilePath and descriptorType is swapped
            this.workflowsService.registerCheckerWorkflow(workflowPath, this.entryId, testParameterFilePath, descriptorType).
                subscribe((entry: Entry) => {
                    // Only update our current list of workflows when the current entry is a workflow
                    // Switching to my-workflows will automatically update the entire list with a fresh HTTP request
                    if (entry.hasOwnProperty('is_checker')) {
                        this.workflowService.upsertWorkflowToWorkflow(<Workflow>entry);
                    }
                    this.isModalShown$.next(false);
                    this.refreshService.handleSuccess(message);
            }, error => {
                this.refreshService.handleError('Could not register checker workflow', error);
            });
        }
    }

    add(): void {
        this.mode$.next('add');
        this.showModal();
        // Placeholder for endpoint
    }

    delete(): void {
        // Placeholder for endpoint
    }

    showModal(): void {
        this.isModalShown$.next(true);
    }

    hideModal(): void {
        this.isModalShown$.next(false);
    }

    clearError(): void {
        this.errorService.setErrorAlert(null);
    }

}

