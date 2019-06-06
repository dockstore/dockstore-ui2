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

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionQuery } from 'app/shared/session/session.query';
import { SessionService } from 'app/shared/session/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-containers',
  templateUrl: './containers.component.html'
})
export class ContainersComponent implements OnInit {
  entryPageTitle$: Observable<string>;
  constructor(private sessionService: SessionService, private activatedRoute: ActivatedRoute, private sessionQuery: SessionQuery) { }

  ngOnInit() {
    this.sessionService.setEntryType(this.activatedRoute.snapshot.data['entryType']);
    this.entryPageTitle$ = this.sessionQuery.entryPageTitle$;
  }

}
