/**
 *    Copyright 2019 OICR
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
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const workflowVersionsEndpoint = /workflows\/\d+\/workflowVersions$/;

/**
 * An interceptor that ensures that PUT requests on the workflowVersions
 * endpoint have the sourceFiles property set to an empty array.
 *
 * The sourceFiles property is ignored by the web service endpoint, but can be
 * sizeable. This affects performance and more importantly, can run into a max
 * request limit size that we have on our nginx server.
 *
 * See https://github.com/dockstore/dockstore/issues/2833
 */
@Injectable()
export class WorkflowVersionsInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // In my tests, the body was an array of length 1. I assume it is an array to handle
    // multipart form requests. To be safe, just handling arrays of size 1.
    if (req.method === 'PUT' && workflowVersionsEndpoint.test(req.url) && req.body && req.body.length === 1) {
      const emptySourceFiles = { sourceFiles: [] };
      const newBody = [{ ...req.body[0], ...emptySourceFiles }];
      return next.handle(req.clone({ body: newBody }));
    }
    return next.handle(req);
  }
}
