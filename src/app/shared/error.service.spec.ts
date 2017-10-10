import { ErrorService } from './error.service';
import { TestBed, inject } from '@angular/core/testing';

describe('ErrorService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [ ErrorService ],
        });
    });

    it('should be created', inject([ErrorService], (service: ErrorService) => {
        expect(service).toBeTruthy();
    }));
    it('should have multiple docs', inject([ErrorService], (service: ErrorService) => {
        service.setErrorAlert({'status': 'status', 'statusText': 'statusText', '_body': '_body'});
        const errorObj: any = {
            message: 'The webservice encountered an error trying to create/modify.',
            errorDetails: '[HTTP ' + 'status' + '] ' + 'statusText' + ': ' +
            '_body'
        };
        expect(service.errorObj$.getValue()).toEqual(errorObj);
    }));
});
