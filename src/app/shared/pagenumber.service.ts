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
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PageInfo } from './../shared/models/PageInfo';

@Injectable()
export class PagenumberService {
  private pgNumToolsSource = new BehaviorSubject<any>(null);
  pgNumTools$ = this.pgNumToolsSource.asObservable(); // This is the selected tool

  private pgNumWorkflowsSource = new BehaviorSubject<any>(null);
  pgNumWorkflows$ = this.pgNumWorkflowsSource.asObservable(); // This is the selected tool

  private backRouteSource = new BehaviorSubject<any>(null);
  needSetPageNumber: boolean;
  constructor() {
    this.needSetPageNumber = false;
  }
  setToolsPageInfo(pginfo: PageInfo) {
    this.pgNumToolsSource.next(pginfo);
  }
  setWorkflowPageInfo(pginfo: PageInfo) {
    this.pgNumWorkflowsSource.next(pginfo);
  }
  setBackRoute(backRoute) {
    this.backRouteSource.next(backRoute);
  }
}
