import { StateService } from './../../shared/state.service';
import { WorkflowWebService } from './../../shared/webservice/workflow-web.service';
import { WorkflowService } from './../../shared/workflow.service';
import { SourceFile } from './../../shared/swagger/model/sourceFile';
import { WorkflowVersion } from './../../shared/swagger/model/workflowVersion';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class VersionModalService {
    isModalShown: Subject<boolean> = new BehaviorSubject<boolean>(false);
    version: Subject<WorkflowVersion> = new BehaviorSubject<WorkflowVersion>(null);
    testParameterFiles: Subject<SourceFile[]> = new BehaviorSubject<SourceFile[]>([]);
    private workflowId;
    constructor(
        private stateService: StateService, private workflowService: WorkflowService, private workflowWebService: WorkflowWebService) {
        workflowService.workflow$.subscribe(workflow => {
            if (workflow) {
                this.workflowId = workflow.id;
            }
        });
    }
    setIsModalShown(isModalShown: boolean) {
        this.isModalShown.next(isModalShown);
    }

    setVersion(version: WorkflowVersion) {
        this.version.next(version);
    }

    setTestParameterFiles(testParameterFiles: SourceFile[]) {
        this.testParameterFiles.next(testParameterFiles);
    }

    saveVersion(workflowVersion: WorkflowVersion, originalTestParameterFilePaths, newTestParameterFiles) {
        this.stateService.setRefreshing(true);
        const newCWL = newTestParameterFiles.filter(x => originalTestParameterFilePaths.indexOf(x) === -1);
        if (newCWL && newCWL.length > 0) {
            this.workflowWebService.addTestParameterFiles(this.workflowId, newCWL, null, workflowVersion.name).subscribe();
        }
        const missingCWL = originalTestParameterFilePaths.filter(x => newTestParameterFiles.indexOf(x) === -1);
        if (missingCWL && missingCWL.length > 0) {
            this.workflowWebService.deleteTestParameterFiles(this.workflowId, missingCWL, workflowVersion.name).subscribe();
        }
        this.workflowWebService.updateWorkflowVersion(this.workflowId, [workflowVersion]).subscribe(
            response => this.stateService.setRefreshing(false));
            this.setIsModalShown(false);
    }
}
