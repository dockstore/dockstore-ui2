/*
 *
 *  Copyright 2024 OICR and UCSC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *
 */

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedService } from './shared.service';
import { ConfigService } from './config.service';
import { joinUrl } from './utils';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class LocalService {
  constructor(private http: HttpClient, private shared: SharedService, private config: ConfigService) {}

  public login<T extends string | object>(user: string | object, url?: string): Observable<T> {
    return this.http
      .post<T>(url || joinUrl(this.config.options.baseUrl, this.config.options.loginUrl), user)
      .pipe(tap((data) => this.shared.setToken(data)));
  }

  public signup<T = any>(user: string | object, url?: string): Observable<T> {
    return this.http.post<T>(url || joinUrl(this.config.options.baseUrl, this.config.options.signupUrl), user);
  }
}
