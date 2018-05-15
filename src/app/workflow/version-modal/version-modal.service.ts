import { Observable } from 'rxjs/Observable';
import { RefreshService } from './../../shared/refresh.service';
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

import { WorkflowsService } from './../../shared/swagger/api/workflows.service';
import { StateService } from './../../shared/state.service';
import { WorkflowService } from './../../shared/workflow.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { Workflow } from './../../shared/swagger/model/workflow';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/concatMap';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class VersionModalService {
    isModalShown$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);
    testParameterFiles: Subject<SourceFile[]> = new BehaviorSubject<SourceFile[]>([]);
    private workflowId;
    constructor(
        private stateService: StateService, private workflowService: WorkflowService, private workflowsService: WorkflowsService,
        private refreshService: RefreshService) {
        workflowService.workflow$.subscribe(workflow => {
            if (workflow) {
                this.workflowId = workflow.id;
            }
        });
    }
    setIsModalShown(isModalShown: boolean) {
        this.isModalShown$.next(isModalShown);
    }

    setVersion(version: WorkflowVersion) {
        this.version.next(version);
    }

    setTestParameterFiles(testParameterFiles: SourceFile[]) {
        this.testParameterFiles.next(testParameterFiles);
    }

    /**
     * Saves the version.  This contains 4 parts:
     * 1. PUT workflowVersions
     * 2. Refresh workflow
     * 3. Modify test parameter files
     * 4. Refresh workflow again
     * TODO: Skip 2 and 3 if there's no test parameter files to modify
     *
     * @param {WorkflowVersion} workflowVersion
     * @param {any} originalTestParameterFilePaths
     * @param {any} newTestParameterFiles
     * @memberof VersionModalService
     */
    saveVersion(workflowVersion: WorkflowVersion, originalTestParameterFilePaths, newTestParameterFiles, workflowMode: String) {
        const message1 = 'Saving workflow version';
        const message2 = 'Refreshing workflow';
        const message3 = 'Modifying test parameter files';
        this.setIsModalShown(false);
        this.stateService.setRefreshMessage(message1 + '...');
        if (workflowMode !== 'HOSTED') {
          this.workflowsService.updateWorkflowVersion(this.workflowId, [workflowVersion]).subscribe(
              response => {
                  this.refreshService.handleSuccess(message1);
                  this.stateService.setRefreshMessage(message2 + '...');
                  this.workflowsService.refresh(this.workflowId).subscribe(workflow => {
                      this.refreshService.handleSuccess(message2);
                      this.stateService.setRefreshMessage(message3 + '...');
                      this.modifyTestParameterFiles(workflowVersion, originalTestParameterFilePaths, newTestParameterFiles).subscribe(
                          success => {
                              this.refreshService.handleSuccess(message3);
                              this.refreshService.refreshWorkflow();
                          }, error => {
                              this.refreshService.handleError(message3, error);
                              this.refreshService.refreshWorkflow();
                          });
                  },
                      error => {
                          this.refreshService.handleError(message2, error);
                      });
              }, error => {
                  this.refreshService.handleError(message1, error);
              }
          );
        } else {
          this.workflowsService.updateWorkflowVersion(this.workflowId, [workflowVersion]).subscribe(
              response => {
                  this.refreshService.handleSuccess(message1);
              }, error => {
                  this.refreshService.handleError(message1, error);
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
        if (toDelete && toAdd) {
            return this.workflowsService.addTestParameterFiles(this.workflowId, newCWL, null, workflowVersion.name).concatMap(() =>
                this.workflowsService.deleteTestParameterFiles(this.workflowId, missingCWL, workflowVersion.name));
        }
        if (toDelete && !toAdd) {
            return this.workflowsService.deleteTestParameterFiles(this.workflowId, missingCWL, workflowVersion.name);
        }
        if (toAdd && !toDelete) {
            return this.workflowsService.addTestParameterFiles(this.workflowId, newCWL, null, workflowVersion.name);
        }
        if (!toAdd && !toDelete) {
            return Observable.of({});
        }
    }
}
