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
import { Injectable, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SessionQuery } from '../session/session.query';
import { UserQuery } from '../user/user.query';

@Injectable()
export class RefreshOrganizationComponent implements OnInit, OnDestroy {
  protected userId: number;
  @Input() protected organization: string;
  protected refreshMessage: string;
  protected ngUnsubscribe: Subject<{}> = new Subject();
  constructor(private userQuery: UserQuery, protected sessionQuery: SessionQuery) {
  }

  ngOnInit() {
    this.userQuery.userId$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(userId => this.userId = userId);
    this.sessionQuery.refreshMessage$.pipe(
      takeUntil(this.ngUnsubscribe)).subscribe((refreshMessage: string) => this.refreshMessage = refreshMessage);
  }

  toDisable(): boolean {
    return this.refreshMessage !== null && this.refreshMessage !== undefined;
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
