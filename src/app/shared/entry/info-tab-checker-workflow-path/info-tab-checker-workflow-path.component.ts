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
import { MatDialog } from '@angular/material/dialog';
import { Workflow } from 'app/shared/swagger';
import { Observable } from 'rxjs';
import { AlertQuery } from '../../alert/state/alert.query';
import { Base } from '../../base';
import { ExtendedWorkflowsService } from '../../extended-workflows.service';
import { SessionQuery } from '../../session/session.query';
import { CheckerWorkflowQuery } from '../../state/checker-workflow.query';
import { CheckerWorkflowService } from '../../state/checker-workflow.service';
import { WorkflowService } from '../../state/workflow.service';
import { RegisterCheckerWorkflowComponent } from '../register-checker-workflow/register-checker-workflow.component';
import { RegisterCheckerWorkflowService } from '../register-checker-workflow/register-checker-workflow.service';

@Component({
  selector: 'app-info-tab-checker-workflow-path',
  templateUrl: './info-tab-checker-workflow-path.component.html',
  styleUrls: ['./info-tab-checker-workflow-path.component.scss'],
})
export class InfoTabCheckerWorkflowPathComponent extends Base implements OnInit, OnDestroy {
  isPublic$: Observable<boolean>;
  isStub$: Observable<boolean>;
  parentId$: Observable<number>;
  checkerWorkflowURL$: Observable<string>;
  isRefreshing$: Observable<boolean>;
  checkerId$: Observable<number>;
  canAdd$: Observable<boolean>;
  canView$: Observable<boolean>;
  checkerWorkflow$: Observable<Workflow>;
  @Input() canRead: boolean;
  @Input() canWrite: boolean;
  @Input() isOwner: boolean;
  @Input() isPublished: boolean;
  @Input() workflowMode: Workflow.ModeEnum;
  @Input() workflowId: number;
  public WorkflowType = Workflow;
  modeTooltipContent = `STUB: Basic metadata pulled from source control.
  FULL: Full content synced from source control.
  HOSTED: Workflow metadata and files hosted on Dockstore.`;

  constructor(
    private checkerWorkflowService: CheckerWorkflowService,
    private checkerWorkflowQuery: CheckerWorkflowQuery,
    private registerCheckerWorkflowService: RegisterCheckerWorkflowService,
    private alertQuery: AlertQuery,
    private sessionQuery: SessionQuery,
    private matDialog: MatDialog,
    private workflowService: WorkflowService,
    private workflowsService: ExtendedWorkflowsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.isRefreshing$ = this.alertQuery.showInfo$;
    this.parentId$ = this.checkerWorkflowQuery.parentId$;
    this.isPublic$ = this.sessionQuery.isPublic$;
    this.isStub$ = this.checkerWorkflowQuery.isStub$;
    this.checkerWorkflow$ = this.checkerWorkflowQuery.checkerWorkflow$;
    this.checkerWorkflowURL$ = this.checkerWorkflowService.getCheckerWorkflowURLObservable(
      this.checkerWorkflowQuery.checkerWorkflow$,
      this.isPublic$
    );
    this.checkerId$ = this.checkerWorkflowQuery.checkerId$;
    this.canAdd$ = this.checkerWorkflowService.canAdd(this.checkerId$, this.parentId$, this.isStub$);
  }

  add(): void {
    this.registerCheckerWorkflowService.add();
    this.matDialog.open(RegisterCheckerWorkflowComponent, { width: '600px' });
  }

  delete(): void {
    this.registerCheckerWorkflowService.delete();
  }

/**
   * Handle restubbing a workflow
   * TODO: Handle non-checker workflow restub error
   *
   * @memberof InfoTabCheckerWorkflowPathComponent
   */
 restubWorkflow() {
  this.workflowsService.restub(this.workflowId).subscribe((restubbedWorkflow: Workflow) => {
    this.workflowService.setWorkflow(restubbedWorkflow);
    this.workflowService.upsertWorkflowToWorkflow(restubbedWorkflow);
  });
}

  /**
   * This is bad, change it to get the URL and make the button a link instead
   *
   * @memberof InfoTabCheckerWorkflowPathComponent
   */
  viewParentEntry(): void {
    this.checkerWorkflowService.goToParentEntry();
  }
}
