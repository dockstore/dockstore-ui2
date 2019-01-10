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
import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { DateService } from '../../shared/date.service';
import { SessionQuery } from '../../shared/session/session.query';
import { HostedService } from '../../shared/swagger/api/hosted.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Workflow } from '../../shared/swagger/model/workflow';
import { View } from '../../shared/view';
import { VersionModalService } from '../version-modal/version-modal.service';
import { takeUntil } from 'rxjs/operators';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { MatDialog } from '@angular/material';
import { VersionModalComponent } from '../version-modal/version-modal.component';

@Component({
  selector: 'app-view-workflow',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewWorkflowComponent extends View implements OnInit {
  @Input() workflowId: number;
  @Input() canRead: boolean;
  @Input() canWrite: boolean;
  @Input() isOwner: boolean;
  items: any[];
  isPublic: boolean;
  public workflow: Workflow;
  public WorkflowType = Workflow;

  constructor(
    private workflowService: WorkflowService, private workflowQuery: WorkflowQuery,
    private versionModalService: VersionModalService, private sessionQuery: SessionQuery,
    private workflowsService: WorkflowsService, private matDialog: MatDialog,
    private hostedService: HostedService,
    dateService: DateService) {
    super(dateService);
  }

  showVersionModal() {
    this.versionModalService.setVersion(this.version);
    this.workflowsService.getTestParameterFiles(this.workflowId, this.version.name)
      .subscribe(items => {
        this.items = items;
        this.versionModalService.setTestParameterFiles(this.items);
        this.openVersionModal();
      }, error => {
        this.openVersionModal();
      });
  }

  /**
   * Opens the version modal
   *
   * @private
   * @memberof ViewWorkflowComponent
   */
  private openVersionModal(): void {
    const dialogRef = this.matDialog.open(VersionModalComponent,
      {
        width: '600px',
        data: { canRead: this.canRead, canWrite: this.canWrite, isOwner: this.isOwner }
      });
  }

  ngOnInit() {
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isPublic => this.isPublic = isPublic);
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => this.workflow = workflow);
  }

  deleteHostedVersion() {
    const deleteMessage = 'Are you sure you want to delete version ' +
      this.version.name + ' for workflow ' + this.workflow.full_workflow_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.hostedService.deleteHostedWorkflowVersion(this.workflow.id, this.version.name).subscribe(
        result => {
          this.workflowService.setWorkflow(result);
        }, (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    }
  }
}
