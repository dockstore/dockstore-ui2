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

import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs/Observable';

import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { WorkflowsStubService } from './../../test/service-stubs';
import { DagService } from './dag.service';

/* tslint:disable:no-unused-variable */

describe('Service: Dag', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DagService, {
        provide: WorkflowsService, useClass: WorkflowsStubService
      }]
    });
  });

  it('should ...', inject([DagService], (service: DagService) => {
    expect(service).toBeTruthy();
  }));
  it('should check if it\'s n/a', inject([DagService], (service: DagService) => {
    expect(service.isNA('n/a')).toBeTruthy();
    expect(service.isNA('asdf')).toBeFalsy();
  }));
  it('should set dynamic popover with lots of n/a', inject([DagService], (service: DagService) => {
    service.getTooltipText(undefined, '', undefined, undefined, undefined);
    expect(service.dynamicPopover).toEqual({
      link: '',
      title: 'n/a',
      type: 'n/a',
      docker: 'n/a',
      run: 'n/a'
    });
  }));
  it('should set dynamic popover with lots of other info', inject([DagService], (service: DagService) => {
    service.getTooltipText(undefined, '', undefined, 'valid link', 'http://fakewebsite.com');
    expect(service.dynamicPopover).toEqual({
      link: '',
      title: 'n/a',
      type: 'n/a',
      docker: 'valid link',
      run: 'http://fakewebsite.com'
    });
  }));
  it('should set the observables properly', inject([DagService], (service: DagService) => {
    service.setCurrentVersion(2);
    service.setCurrentWorkflowId(2);
    service.setDagResults(2);
    service.currentDagResults.subscribe(results => expect(results).toEqual(2));
    service.currentWorkflowId.subscribe(results => expect(results).toEqual(2));
    service.currentVersion.subscribe(results => expect(results).toEqual(2));
  }));
  it('should get DAG', inject([DagService], (service: DagService) => {
    expect(service.getCurrentDAG(2, 2)).toEqual(Observable.of('someDAG'));
    expect(service.getCurrentDAG(null, null)).toBeFalsy();
  }));
});
