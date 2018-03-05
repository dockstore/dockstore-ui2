import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { CheckerWorkflowService } from './checker-workflow.service';
import { ContainerService } from './container.service';
import { StateService } from './state.service';
import { WorkflowsService } from './swagger/api/workflows.service';
import { WorkflowService } from './workflow.service';

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
  const fakeContainerService = new ContainerService();
  const fakeWorkflowService = new WorkflowService();

  it('should be able to get the checker workflow when not logged in', () => {
    const spy = spyOn(fakeWorkflowsService, 'getPublishedWorkflow').and.returnValue(Observable.of(stubPublishedWorkflow));
    service = new CheckerWorkflowService(fakeWorkflowsService, fakeStateService, fakeWorkflowService,
      fakeContainerService, null);
    expect(service).toBeTruthy();
    fakeStateService.publicPage$.next(true);
    fakeWorkflowService.setWorkflow({ id: 1 });
    const sub1: Subscription = service.checkerWorkflowPath$.subscribe(path => {
      expect(path).toBe('potato');
    });
    sub1.unsubscribe();
  });
  it('should be able to get the checker workflow when logged in', () => {
    const spy = spyOn(fakeWorkflowsService, 'getWorkflow').and.returnValue(Observable.of(stubUnpublishedWorkflow));
    const spy2 = spyOn(fakeWorkflowsService, 'getPublishedWorkflow').and.returnValue(Observable.of(stubPublishedWorkflow));
    service = new CheckerWorkflowService(fakeWorkflowsService, fakeStateService, fakeWorkflowService, fakeContainerService, null);
    fakeStateService.publicPage$.next(false);
    expect(service).toBeTruthy();
    fakeWorkflowService.setWorkflow({ id: 1 });
    const sub1: Subscription = service.checkerWorkflowPath$.subscribe(path => {
      expect(path).toBe('chicken');
    });
    sub1.unsubscribe();
  });
});
