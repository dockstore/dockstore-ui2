import { Observable } from 'rxjs/Observable';

import { CheckerWorkflowService } from './checker-workflow.service';
import { WorkflowsService } from './swagger/api/workflows.service';

describe('Service: CheckerWorkflow', () => {
  let service: CheckerWorkflowService;

  it('should ...', () => {
    const fakeWorkflowsService = new WorkflowsService(null, null, null);
    const stubWorkflow = {
      path: 'potato'
    };
    const spy = spyOn(fakeWorkflowsService, 'getPublishedWorkflow').and.returnValue(Observable.of(stubWorkflow));
    service = new CheckerWorkflowService(fakeWorkflowsService);
    expect(service).toBeTruthy();
    service.getCheckerWorkflowPath(1);
    service.checkerWorkflowPath$.subscribe(path => {
      expect(path).toBe('potato');
    });
  });
});
