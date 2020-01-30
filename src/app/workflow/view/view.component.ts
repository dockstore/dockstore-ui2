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
import { MatDialog } from '@angular/material/dialog';
import { EntryType } from 'app/shared/enum/entry-type';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { Service } from 'app/shared/swagger/model/service';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertQuery } from '../../shared/alert/state/alert.query';
import { AlertService } from '../../shared/alert/state/alert.service';
import { DateService } from '../../shared/date.service';
import { SessionQuery } from '../../shared/session/session.query';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { HostedService } from '../../shared/swagger/api/hosted.service';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { Workflow } from '../../shared/swagger/model/workflow';
import { View } from '../../shared/view';
import { VersionModalComponent } from '../version-modal/version-modal.component';
import { VersionModalService } from '../version-modal/version-modal.service';
import { ViewService } from './view.service';

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
  EntryType = EntryType;
  public entryType$: Observable<EntryType>;
  public workflow: BioWorkflow | Service;
  public WorkflowType = Workflow;
  constructor(
    alertQuery: AlertQuery,
    private viewService: ViewService,
    private workflowService: WorkflowService,
    private workflowQuery: WorkflowQuery,
    private versionModalService: VersionModalService,
    private sessionQuery: SessionQuery,
    private workflowsService: WorkflowsService,
    private matDialog: MatDialog,
    private hostedService: HostedService,
    dateService: DateService,
    private alertService: AlertService
  ) {
    super(dateService, alertQuery);
  }

  showVersionModal() {
    this.versionModalService.setVersion(this.version);
    this.alertService.start('Getting test parameter files');
    this.workflowsService.getTestParameterFiles(this.workflowId, this.version.name).subscribe(
      items => {
        this.items = items;
        this.versionModalService.setTestParameterFiles(this.items);
        this.openVersionModal();
        this.alertService.simpleSuccess();
      },
      error => {
        // TODO: Figure out a better way to handle this
        // If we were to open the modal without test parameter files and the user saves,
        // the legit files that were already there would be wiped out
        // This is why we're straight up not opening the modal if getting the test parameter files failed
        // Need to figure out a way to allow the user to edit version properties without test parameter files
        this.alertService.detailedError(error);
      }
    );
  }

  updateDefaultVersion() {
    this.viewService.updateDefaultVersion(this.version.name);
  }

  /**
   * Opens the version modal
   *
   * @private
   * @memberof ViewWorkflowComponent
   */
  private openVersionModal(): void {
    const dialogRef = this.matDialog.open(VersionModalComponent, {
      width: '600px',
      data: { canRead: this.canRead, canWrite: this.canWrite && !this.version.frozen, isOwner: this.isOwner }
    });
  }

  /**
   * Handles the create DOI button being clicked
   *
   * @memberof ViewWorkflowComponent
   */
  requestDOIForWorkflowVersion() {
    this.viewService.requestDOIForWorkflowVersion(this.workflow, this.version);
  }

  /**
   * Opens a confirmation dialog that the Dockstore User can use to
   * confirm they want a snapshot.
   *
   * @memberof ViewWorkflowComponent
   */
  snapshotVersion(): void {
    this.viewService.snapshotVersion(this.workflow, this.version);
  }

  ngOnInit() {
    this.entryType$ = this.sessionQuery.entryType$;
    this.sessionQuery.isPublic$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isPublic => (this.isPublic = isPublic));
    this.workflowQuery.workflow$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(workflow => (this.workflow = workflow));
  }

  deleteHostedVersion() {
    const deleteMessage =
      'Are you sure you want to delete version ' + this.version.name + ' for workflow ' + this.workflow.full_workflow_path + '?';
    const confirmDelete = confirm(deleteMessage);
    if (confirmDelete) {
      this.hostedService.deleteHostedWorkflowVersion(this.workflow.id, this.version.name).subscribe(
        result => {
          this.workflowService.setWorkflow(result);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      );
    }
  }
}
