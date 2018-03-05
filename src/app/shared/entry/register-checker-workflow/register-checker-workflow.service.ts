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
    constructor(private stateService: StateService, private errorService: ErrorService) {
        this.refreshMessage$ = this.stateService.refreshMessage$;
        this.errorObj$ = this.errorService.errorObj$;
    }

    registerCheckerWorkflow(workflowPath: string, testParameterFilePath: string, syncTestJson: boolean): void {
        // Placeholder for endpoint
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

