/*
 *    Copyright 2018 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License")
 *    you may not use this file except in compliance with the License
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckerWorkflowQuery } from '../../state/checker-workflow.query';

@Component({
  selector: 'app-launch-checker-workflow',
  templateUrl: './launch-checker-workflow.component.html',
  styleUrls: ['./launch-checker-workflow.component.scss'],
})
export class LaunchCheckerWorkflowComponent implements OnInit {
  @Input() command: string;
  @Input() versionName: string;
  command$: Observable<string>;
  checkerWorkflowPath$: Observable<string>;
  constructor(private checkerWorkflowQuery: CheckerWorkflowQuery) {
    this.checkerWorkflowPath$ = this.checkerWorkflowQuery.checkerWorkflowPath$;
  }

  ngOnInit() {}
}
