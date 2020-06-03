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
import { Injectable, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AlertQuery } from '../alert/state/alert.query';
import { Base } from '../base';
import { UserQuery } from '../user/user.query';

@Injectable()
export abstract class RefreshOrganizationComponent extends Base implements OnInit {
  protected userId: number;
  buttonText: string;
  public isRefreshing$: Observable<boolean>;
  constructor(private userQuery: UserQuery, protected alertQuery: AlertQuery) {
    super();
  }

  ngOnInit() {
    this.userQuery.userId$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(userId => (this.userId = userId));
    this.isRefreshing$ = this.alertQuery.showInfo$;
  }
}
