import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable } from '@angular/core';

@Injectable()
export class ErrorService {
    errorObj$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    constructor() { }
    setErrorAlert(error: any) {
        let errorObj = null;
        if (error) {
            errorObj = {
                message: 'The webservice encountered an error trying to create/modify.',
                errorDetails: '[HTTP ' + error.status + '] ' + error.statusText + ': ' +
                error._body
            };
        }
        this.errorObj$.next(errorObj);
    }
}
