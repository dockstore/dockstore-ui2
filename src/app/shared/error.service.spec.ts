/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { HttpErrorResponse } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';

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
        const baseErrorStub = {
            'message': 'potato', 'name': 'HttpErrorResponse', 'status': 400, 'statusText': 'statusText', 'error': 'error'};
        const errorStub = new HttpErrorResponse(baseErrorStub);
        service.setErrorAlert(errorStub);
        const errorObj: any = {
            message: 'The webservice encountered an error trying to create/modify.',
            errorDetails: '[HTTP ' + '400' + '] ' + 'statusText' + ': ' +
            'error'
        };
        console.log(service.errorObj$.getValue());
        console.log(errorObj);
        expect(service.errorObj$.getValue()).toEqual(errorObj);
    }));
});
