import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CheckerWorkflowService } from './checker-workflow.service';
import { StateService } from './state.service';
import { WorkflowsService } from './swagger/api/workflows.service';

describe('Service: CheckerWorkflow', () => {
  let service: CheckerWorkflowService;
  const stubPublishedWorkflow = {
    path: 'potato'
  };
  const stubUnpublishedWorkflow = {
    path: 'chicken'
  };
  const fakeWorkflowsService = new WorkflowsService(null, null, null);
  const fakeStateService = new StateService();

  it('should be able to get the checker workflow when not logged in', () => {
    const spy = spyOn(fakeWorkflowsService, 'getPublishedWorkflow').and.returnValue(Observable.of(stubPublishedWorkflow));
    service = new CheckerWorkflowService(fakeWorkflowsService, fakeStateService);
    expect(service).toBeTruthy();
    fakeStateService.publicPage$.next(true);
    service.getCheckerWorkflowPath(1);
    const sub1: Subscription = service.checkerWorkflowPath$.subscribe(path => {
      expect(path).toBe('potato');
    });
  });
  it('should be able to get the checker workflow when logged in', () => {
    const spy = spyOn(fakeWorkflowsService, 'getWorkflow').and.returnValue(Observable.of(stubUnpublishedWorkflow));
    service = new CheckerWorkflowService(fakeWorkflowsService, fakeStateService);
    fakeStateService.publicPage$.next(false);
    expect(service).toBeTruthy();
    service.getCheckerWorkflowPath(1);
    const sub1: Subscription = service.checkerWorkflowPath$.subscribe(path => {
      expect(path).toBe('chicken');
    });
  });
});
