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
import { bootstrap4mediumModalSize } from '../../shared/constants';

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
   * Updates the workflow version and alerts the Dockstore User with success
   * or failure.
   *
   * @private
   * @memberof ViewService
   */
  private updateWorkflowToSnapshot(workflow: Workflow, version: WorkflowVersion, cb: Function): void {
    const snapshot: WorkflowVersion = { ...version, frozen: true };
    this.workflowsService.updateWorkflowVersion(workflow.id, [snapshot]).subscribe(
      (workflowVersions: Array<WorkflowVersion>) => {
        const selectedWorkflow = { ...this.workflowQuery.getActive() };
        if (selectedWorkflow.id === workflow.id) {
          this.workflowService.setWorkflow({ ...selectedWorkflow, workflowVersions: workflowVersions });
        }
        cb(workflowVersions);
      },
      (error: HttpErrorResponse) => {
        if (error) {
          this.alertService.detailedError(error);
        } else {
          this.alertService.simpleError();
        }
      }
    );
  }

  /**
   * Opens a confirmation dialog that the Dockstore User can use to
   * confirm they want before creating a DOI. Then opens the DOI dialog.
   *
   * @memberof ViewService
   */
  private showSnapshotBeforeDOIDialog(workflow: Workflow, version: WorkflowVersion): void {
    const dialogData: ConfirmationDialogData = {
      message: `A Digital Object Identifier (DOI) allows a version to be easily cited in publications and is only
                available for versions that have been snapshotted. You will then be asked if you want to generate a
                DOI. <p>Would you like to create a snapshot for <b>${version.name}</b>?`,
      title: 'Issue DOI (Snapshot Version)',
      confirmationButtonText: 'Snapshot Version',
      cancelButtonText: 'Cancel'
    };

    this.confirmationDialogService.openDialog(dialogData, bootstrap4mediumModalSize).subscribe(confirmationResult => {
      if (confirmationResult) {
        this.updateWorkflowToSnapshot(workflow, version, () => this.showRequestDOIDialog(workflow, version));
      } else {
        this.alertService.detailedSuccess('You cancelled DOI creation.');
      }
    });
  }

  /**
   * Opens a dialog to request whether the user would like to issue a DOI.
   *
   * @private
   * @memberof ViewService
   */
  private showRequestDOIDialog(workflow: Workflow, version: WorkflowVersion): void {
    const dialogData: ConfirmationDialogData = {
      message: `A Digital Object Identifier (DOI) allows a version to be easily cited in publications and can't be
                undone, though some metadata will remain editable. It can take some time to request a DOI.
                Are you sure you'd like to create a DOI for version
                <b>${version.name}</b>?`,
      title: 'Issue DOI',
      confirmationButtonText: 'Issue DOI',
      cancelButtonText: 'Cancel'
    };

    this.confirmationDialogService.openDialog(dialogData, bootstrap4mediumModalSize).subscribe(confirmationResult => {
      if (confirmationResult) {
        this.workflowsService
          .requestDOIForWorkflowVersion(workflow.id, version.id)
          .subscribe(
            (versions: Array<WorkflowVersion>) => this.requestDOISuccess({ ...workflow, workflowVersions: versions }, version),
            (errorResponse: HttpErrorResponse) => this.alertService.detailedError(errorResponse)
          );
      } else {
        this.alertService.detailedSuccess('You cancelled DOI issuance.');
      }
    });
  }

  /**
   * A helper function for updating the store and relating success on DOI creation.
   *
   * @private
   * @memberof ViewService
   */
  private requestDOISuccess(workflow: Workflow, version: WorkflowVersion): void {
    const selectedWorkflow = { ...this.workflowQuery.getActive() };
    if (selectedWorkflow.id === workflow.id) {
      this.workflowService.setWorkflow(workflow);
    }
    this.alertService.detailedSuccess(`A Digital Object Identifier (DOI) was successfully requested for workflow
                                       "${workflow.workflowName}" version "${version.name}"!`);
  }

  /**
   * Opens a confirmation dialog that the Dockstore User can use to
   * confirm they want a snapshot.
   *
   * @memberof ViewService
   */
  snapshotVersion(workflow: Workflow, version: WorkflowVersion): void {
    if (version.frozen) {
      // Guarantee we don't snapshot a snapshot
      return;
    }
    const dialogData: ConfirmationDialogData = {
      message: `Snapshotting a version will make it so it can no longer be edited and cannot be undone. <p>Are
                you sure you would like to snapshot version <b>${version.name}</b>?`,
      title: 'Snapshot',
      confirmationButtonText: 'Snapshot Version',
      cancelButtonText: 'Cancel'
    };
    this.confirmationDialogService.openDialog(dialogData, bootstrap4mediumModalSize).subscribe((confirmationResult: Boolean) => {
      if (confirmationResult) {
        this.updateWorkflowToSnapshot(workflow, version, () => this.alertService.detailedSuccess('Snapshot successfully created!'));
      } else {
        this.alertService.detailedSuccess('You cancelled creating a snapshot.');
      }
    });
  }

  /**
   * Entry function for issuing a DOI, opens a dialog depending on the state of the
   * version.
   *
   * @memberof ViewService
   */
  requestDOIForWorkflowVersion(workflow: Workflow, version: WorkflowVersion): void {
    // Set the dialog to open a snapshot if its not frozen
    // TODO check to see if they have a zenodo token
    if (!version.frozen) {
      this.showSnapshotBeforeDOIDialog(workflow, version);
    } else {
      this.showRequestDOIDialog(workflow, version);
    }
  }
}
