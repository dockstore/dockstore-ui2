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
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { StateService } from '../../state.service';
import { CheckerWorkflowService } from './../../checker-workflow.service';
import { Workflow } from './../../swagger/model/workflow';
import { RegisterCheckerWorkflowService } from './../register-checker-workflow/register-checker-workflow.service';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.scss']
})
export class InfoTabCheckerWorkflowPathComponent implements OnInit, OnDestroy {
  isPublic$: Observable<boolean>;
  checkerWorkflow$: Observable<Workflow>;
  isStub$: Observable<boolean>;
  checkerWorkflowPath: string;
  refreshMessage$: Observable<string>;
  @Input() canRead: boolean;
  @Input() canWrite: boolean;
  @Input() isOwner: boolean;
  private ngUnsubscribe: Subject<{}> = new Subject();
  parentId = null;
  constructor(private checkerWorkflowService: CheckerWorkflowService,
    private registerCheckerWorkflowService: RegisterCheckerWorkflowService,
    private stateService: StateService
  ) { }

  ngOnInit(): void {
    this.refreshMessage$ = this.stateService.refreshMessage$;
    this.checkerWorkflow$ = this.checkerWorkflowService.checkerWorkflow$;
    this.checkerWorkflowService.entry$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(thing => {
      this.parentId = this.checkerWorkflowService.parentId;
    });
    this.isPublic$ = this.checkerWorkflowService.publicPage$;
    this.isStub$ = this.checkerWorkflowService.isStub$;
    this.checkerWorkflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((workflow: Workflow) => {
      this.checkerWorkflowPath = this.viewCheckerWorkflow();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  add(): void {
    this.registerCheckerWorkflowService.add();
  }

  viewCheckerWorkflow(): string {
    return this.checkerWorkflowService.getCheckerWorkflowURL();
  }

  delete(): void {
    this.registerCheckerWorkflowService.delete();
  }

  viewParentEntry(): void {
    this.checkerWorkflowService.goToParentEntry();
  }
}
