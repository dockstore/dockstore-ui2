import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { WorkflowVersionsInterceptor } from './workflow-versions.interceptor';

class SourcefilesEmptyChecker extends HttpHandler {
  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    expect(req.body[0].sourceFiles).toEqual([]);
    return undefined;
  }
}

class RequestUnchangedChecker extends HttpHandler {
  constructor(private origRequest: HttpRequest<any>) {
    super();
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    expect(req).toBe(this.origRequest);
    return undefined;
  }
}

describe('WorkflowVersionsInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WorkflowVersionsInterceptor]
    });
  });

  it('Should tranform put', inject([WorkflowVersionsInterceptor], (interceptor: WorkflowVersionsInterceptor) => {
    const httpRequest = new HttpRequest('PUT', 'https://dockstore.org/api/workflows/1234/workflowVersions', [
      { sourceFiles: [{ one: 'something' }] }
    ]);
    const httpHandler = new SourcefilesEmptyChecker();
    interceptor.intercept(httpRequest, httpHandler);
  }));

  it('Should leave other stuff alone', inject([WorkflowVersionsInterceptor], (interceptor: WorkflowVersionsInterceptor) => {
    const body = [{ sourceFiles: [{ one: 'something' }] }];
    const httpRequest1 = new HttpRequest('GET', 'https://dockstore.org/api/workflows/1234/workflowVersions', body);
    const httpHandler = new RequestUnchangedChecker(httpRequest1);
    interceptor.intercept(httpRequest1, httpHandler);

    const httpRequest2 = new HttpRequest('PUT', 'https://dockstore.org/api/tools/1234/workflowVersions', body);
    const httpHandler2 = new RequestUnchangedChecker(httpRequest2);
    interceptor.intercept(httpRequest2, httpHandler2);
  }));
});
