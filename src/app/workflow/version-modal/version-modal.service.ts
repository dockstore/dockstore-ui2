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
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable, of as observableOf, Subject } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { RefreshService } from '../../shared/refresh.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowsService } from '../../shared/swagger/api/workflows.service';
import { SourceFile } from '../../shared/swagger/model/sourceFile';
import { WorkflowVersion } from '../../shared/swagger/model/workflowVersion';

@Injectable()
export class VersionModalService {
  version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);
  testParameterFiles: Subject<SourceFile[]> = new BehaviorSubject<SourceFile[]>([]);
  constructor(
    private alertService: AlertService,
    private workflowQuery: WorkflowQuery,
    private workflowsService: WorkflowsService,
    private refreshService: RefreshService,
    private matDialog: MatDialog
  ) {}

  setVersion(version: WorkflowVersion) {
    this.version.next(version);
  }

  setTestParameterFiles(testParameterFiles: SourceFile[]) {
    this.testParameterFiles.next(testParameterFiles);
  }

  /**
   * Saves the version.  This contains 3 parts:
   * 1. PUT workflowVersions
   * 2. Modify test parameter files
   * 3. Refresh workflow if workflow path has changed or if a test parameter file was added/removed
   *
   * @param {WorkflowVersion} workflowVersion
   * @param {any} originalTestParameterFilePaths
   * @param {any} newTestParameterFiles
   * @memberof VersionModalService
   */
  saveVersion(
    originalVersion: WorkflowVersion,
    workflowVersion: WorkflowVersion,
    originalTestParameterFilePaths,
    newTestParameterFiles,
    workflowMode: String
  ) {
    const message1 = 'Saving workflow version';
    const message2 = 'Modifying test parameter files';
    const workflowId = this.workflowQuery.getActive().id;
    let toRefresh = false;
    // Checks if the workflow path was changed
    if (originalVersion.workflow_path !== workflowVersion.workflow_path) {
      toRefresh = true;
    }
    this.alertService.start(message1);
    if (workflowMode !== 'HOSTED') {
      this.workflowsService.updateWorkflowVersion(workflowId, [workflowVersion]).subscribe(
        response => {
          this.alertService.start(message2);
          this.modifyTestParameterFiles(workflowVersion, originalTestParameterFilePaths, newTestParameterFiles).subscribe(
            success => {
              // Checks if there was a test parameter file added/removed
              // The this.modifyTestParameterFiles function returns a {} observable if nothing was done, this is a way of checking for it
              if (!(Object.keys(success).length === 0 && success.constructor === Object)) {
                toRefresh = true;
              }
              this.alertService.detailedSuccess();
              if (toRefresh) {
                this.refreshService.refreshWorkflow();
              }
              this.matDialog.closeAll();
            },
            error => {
              this.alertService.detailedError(error);
              if (toRefresh) {
                this.refreshService.refreshWorkflow();
              }
            }
          );
        },
        error => {
          this.alertService.detailedError(error);
        }
      );
    } else {
      this.workflowsService.updateWorkflowVersion(workflowId, [workflowVersion]).subscribe(
        response => {
          this.alertService.detailedSuccess();
          this.matDialog.closeAll();
        },
        error => {
          this.alertService.detailedError(error);
        }
      );
    }
  }

  /**
   * This modifies the test parameter file paths of a workflow version
   *
   * @param {WorkflowVersion} workflowVersion
   * @param {any} originalTestParameterFilePaths
   * @param {any} newTestParameterFiles
   * @returns {Observable<any>}
   * @memberof VersionModalService
   */
  modifyTestParameterFiles(workflowVersion: WorkflowVersion, originalTestParameterFilePaths, newTestParameterFiles): Observable<any> {
    const newCWL = newTestParameterFiles.filter(x => !originalTestParameterFilePaths.includes(x));
    const missingCWL = originalTestParameterFilePaths.filter(x => !newTestParameterFiles.includes(x));
    const toAdd: boolean = newCWL && newCWL.length > 0;
    const toDelete: boolean = missingCWL && missingCWL.length > 0;
    const workflowId = this.workflowQuery.getActive().id;
    if (toDelete && toAdd) {
      return this.workflowsService
        .addTestParameterFiles(workflowId, newCWL, workflowVersion.name)
        .pipe(concatMap(() => this.workflowsService.deleteTestParameterFiles(workflowId, missingCWL, workflowVersion.name)));
    }
    if (toDelete && !toAdd) {
      return this.workflowsService.deleteTestParameterFiles(workflowId, missingCWL, workflowVersion.name);
    }
    if (toAdd && !toDelete) {
      return this.workflowsService.addTestParameterFiles(workflowId, newCWL, workflowVersion.name);
    }
    if (!toAdd && !toDelete) {
      return observableOf({});
    }
  }
}
