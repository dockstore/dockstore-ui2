import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { WorkflowQuery } from '../../shared/state/workflow.query';
import { WorkflowService } from '../../shared/state/workflow.service';
import { Workflow, WorkflowsService, WorkflowVersion } from '../../shared/swagger';

@Injectable({
  providedIn: 'root',
})
export class SnapshotExporterModalService {
  constructor(
    private alertService: AlertService,
    private workflowService: WorkflowService,
    private workflowsService: WorkflowsService,
    private workflowQuery: WorkflowQuery
  ) {}

  public snapshotWorkflowVersion(workflow: Workflow, version: WorkflowVersion) {
    const snapshot: WorkflowVersion = { ...version, frozen: true };
    return this.workflowsService.updateWorkflowVersion(workflow.id, [snapshot]).pipe(
      map((workflowVersions: Array<WorkflowVersion>) => {
        this.alertService.detailedSuccess(`A snapshot was created for workflow
                                       "${workflow.workflowName}" version "${version.name}"!`);
        const selectedWorkflow = { ...this.workflowQuery.getActive() };
        if (selectedWorkflow.id === workflow.id) {
          this.workflowService.setWorkflow({ ...selectedWorkflow, workflowVersions: workflowVersions });
        }
      }),
      catchError((error) => {
        if (error) {
          this.alertService.detailedError(error);
        } else {
          this.alertService.simpleError();
        }
        return EMPTY;
      })
    );
  }
}
