import { Observable } from 'rxjs/Observable';
import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { HttpService } from './../../shared/http.service';
import { HttpStubService, WorkflowsStubService } from './../../test/service-stubs';
/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DagService } from './dag.service';

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
