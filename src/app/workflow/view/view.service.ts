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
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { BehaviorSubject, Observable, of as observableOf, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { RefreshService } from '../../shared/refresh.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { WorkflowService } from '../../shared/state/workflow.service';
import { Workflow, WorkflowVersion } from '../../shared/swagger';
import { ConfirmationDialogService } from '../../confirmation-dialog/confirmation-dialog.service';
import { ConfirmationDialogData } from '../../confirmation-dialog/confirmation-dialog.component';

@Injectable()
export class ViewService {
  version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);
  constructor(
    private alertService: AlertService,
    private confirmationDialogService: ConfirmationDialogService,
    private workflowQuery: WorkflowQuery,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
    private refreshService: RefreshService,
    private matDialog: MatDialog
  ) {}

  /**
   * Opens a confirmation dialog that the Dockstore User can use to
   * confirm they want a snapshot.
   *
   * @memberof ViewWorkflowComponent
   */
  snapshotVersion(workflow, version: WorkflowVersion): void {
    if (version.frozen) {
      // Guarantee we don't snapshot a snapshot
      return;
    }
    const snapshot: WorkflowVersion = { ...version, frozen: true };
    const confirmMessage = 'Snapshotting a version cannot be undone. Are you sure you want to snapshot this version?';
    const confirmSnapshot = confirm(confirmMessage);
    if (confirmSnapshot) {
      this.updateWorkflowToSnapshot(workflow, snapshot);
    }
  }

  /**
   * Updates the workflow version and alerts the Dockstore User with success
   * or failure.
   *
   * @private
   * @memberof ViewWorkflowComponent
   */
  private updateWorkflowToSnapshot(workflow, version: WorkflowVersion): void {
    this.workflowsService.updateWorkflowVersion(workflow.id, [version]).subscribe(
      workflowVersions => {
        this.alertService.detailedSuccess('Snapshot successfully created!');
        const workflow = { ...this.workflowQuery.getActive() };
        workflow.workflowVersions = workflowVersions;
        this.workflowService.setWorkflow(workflow);
      },
      error => {
        if (error) {
          this.alertService.detailedError(error);
        } else {
          this.alertService.simpleError();
        }
      }
    );
  }

  showSnapshotBeforeDOIDialog(workflow, version): void {
    const dialogData: ConfirmationDialogData = {
      message:
        'A digital object identifier (DOI) allows a version to be easily cited in publications and is only available for versions that have been snapshotted. Would you like to create a snapshot now? You will then be asked if you want to generate a DOI.',
      title: 'Create DOI (Snapshot Version)',
      confirmationButtonText: 'Snapshot Version',
      cancelButtonText: 'Cancel'
    };
    this.confirmationDialogService.openDialog(dialogData, '500px').subscribe(confirmationResult => {
      if (confirmationResult === true) {
        this.showRequestDOIDialog(workflow, version);
      } else {
        this.alertService.detailedSuccess('You cancelled DOI creation.');
      }
    });
  }

  showRequestDOIDialog(workflow, version): void {
    const dialogData: ConfirmationDialogData = {
      message:
        "A digital object identifier (DOI) allows a version to be easily cited in publications and can't be undone. Are you sure you'd like to create a DOI for this version?",
      title: 'Create DOI',
      confirmationButtonText: 'Create DOI',
      cancelButtonText: 'Cancel'
    };

    this.confirmationDialogService.openDialog(dialogData, '500px').subscribe(confirmationResult => {
      if (confirmationResult === true) {
        this.workflowsService
          .requestDOIForWorkflowVersion(workflow.id, version.id)
          .subscribe(
            versions => this.requestDOISuccess(version, versions),
            errorResponse => this.alertService.detailedError(errorResponse)
          );
      } else {
        this.alertService.detailedSuccess('You cancelled DOI creation.');
      }
    });
  }

  requestDOISuccess(version, workflowVersions: Array<WorkflowVersion>): void {
    const newSelectedVersion = workflowVersions.find(v => v.id === version.id);
    this.workflowService.setWorkflowVersion(newSelectedVersion);
    this.alertService.detailedSuccess();
  }

  requestDOIFailure(errorResponse: HttpErrorResponse) {
    this.alertService.detailedSuccess('You cancelled DOI creation.');
  }

  requestDOIForWorkflowVersion(workflow: Workflow, version: WorkflowVersion): void {
    // Set the dialog to open a snapshot if its not frozen
    if (!version.frozen) {
      this.showSnapshotBeforeDOIDialog(workflow, version);
    } else {
      this.showRequestDOIDialog(workflow, version);
    }
  }
}
