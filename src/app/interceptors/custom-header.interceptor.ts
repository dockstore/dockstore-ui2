/**
 *    Copyright 2020 OICR
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
import { v4 as uuidv4 } from 'uuid';
import { versions } from '../footer/versions';

const uiVersion = versions.tag;
const sessionUUID = uuidv4().toString();

/**
 * An interceptor that ensures that every request has the following custom headers:
 *  - X-Dockstore-UI: Dockstore UI version
 *  - X-Session-ID: UUID for each browser session
 *  - X-Request-ID: UUID for each request
 */
@Injectable()
export class CustomHeaderInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const requestUUID = uuidv4().toString();
    req = req.clone({
      setHeaders: {
        'X-Dockstore-UI': uiVersion,
        'X-Session-ID': sessionUUID,
        'X-Request-ID': requestUUID
      }
    });
    return next.handle(req);
  }
}
