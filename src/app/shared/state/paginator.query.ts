/*
 *    Copyright 2018 OICR
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
import { Query } from '@datorama/akita';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PaginatorState, PaginatorStore } from './paginator.store';

@Injectable({ providedIn: 'root' })
export class PaginatorQuery extends Query<PaginatorState> {
  toolPageSize$: Observable<number> = this.select(state => (this.router.url === '/' ? 10 : state.tool.pageSize));
  workflowPageSize$: Observable<number> = this.select(state => (this.router.url === '/' ? 10 : state.workflow.pageSize));
  toolPageIndex$: Observable<number> = this.select(state => (this.router.url === '/' ? 0 : state.tool.pageIndex));
  workflowPageIndex$: Observable<number> = this.select(state => (this.router.url === '/' ? 0 : state.workflow.pageIndex));
  constructor(protected store: PaginatorStore, private router: Router) {
    super(store);
  }
}
