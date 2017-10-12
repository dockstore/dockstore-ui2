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
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class VersionModalService {
    isModalShown$: Subject<boolean> = new BehaviorSubject<boolean>(false);
    version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);
    testParameterFiles: Subject<SourceFile[]> = new BehaviorSubject<SourceFile[]>([]);
    private workflowId;
    constructor(
        private stateService: StateService, private workflowService: WorkflowService, private workflowsService: WorkflowsService) {
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

    saveVersion(workflowVersion: WorkflowVersion, originalTestParameterFilePaths, newTestParameterFiles) {
        this.stateService.setRefreshMessage('Saving new version...');
        const newCWL = newTestParameterFiles.filter(x => !originalTestParameterFilePaths.includes(x));
        if (newCWL && newCWL.length > 0) {
            this.workflowsService.addTestParameterFiles(this.workflowId, newCWL, null, workflowVersion.name).subscribe();
        }
        const missingCWL = originalTestParameterFilePaths.filter(x => !newTestParameterFiles.includes(x));
        if (missingCWL && missingCWL.length > 0) {
            this.workflowsService.deleteTestParameterFiles(this.workflowId, missingCWL, workflowVersion.name).subscribe();
        }
        this.workflowsService.updateWorkflowVersion(this.workflowId, [workflowVersion]).subscribe(
            response => this.stateService.setRefreshMessage(null));
            this.setIsModalShown(false);
    }
}
