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
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { EntryTab } from '../../shared/entry/entry-tab';
import { ExtendedGA4GHService, Metrics } from '../../shared/openapi';
import { WorkflowLaunchService } from '../launch/workflow-launch.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { GA4GHFilesService } from '../../shared/ga4gh-files/ga4gh-files.service';
import { GA4GHFilesQuery } from '../../shared/ga4gh-files/ga4gh-files.query';
import { SessionQuery } from '../../shared/session/session.query';
import { takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-executions-tab',
  templateUrl: './executions-tab.component.html',
  styleUrls: ['./executions-tab.component.css'],
})
export class ExecutionsTabComponent extends EntryTab implements OnInit, OnChanges {
  constructor(
    private extendedGA4GHService: ExtendedGA4GHService,
    private workflowQuery: WorkflowQuery,
    protected sessionQuery: SessionQuery
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {}

  ngOnInit() {}
}
