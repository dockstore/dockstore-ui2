import { Injectable } from '@angular/core';
import { EMPTY } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AlertService } from '../../shared/alert/state/alert.service';
import { EntriesService } from '../../shared/openapi';
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
    private workflowQuery: WorkflowQuery,
    private entriesService: EntriesService
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

  public requestDOI(workflow: Workflow, version: WorkflowVersion) {
    this.alertService.start(`A Digital Object Identifier (DOI) is being requested for workflow
                                       "${workflow.workflowName}" version "${version.name}"!`);
    return this.workflowsService.requestDOIForWorkflowVersion(workflow.id, version.id).pipe(
      map((versions) => {
        const selectedWorkflow = { ...this.workflowQuery.getActive() };
        if (selectedWorkflow.id === workflow.id) {
          this.workflowService.setWorkflow(workflow);
        }

        const workflowName: string = workflow.workflowName || workflow.repository;

        this.alertService.detailedSuccess(`A Digital Object Identifier (DOI) was created for workflow
                                       "${workflowName}" version "${version.name}"!`);
      }),
      catchError((error) => {
        return EMPTY;
      })
    );
  }

  public exportToOrcid(workflow: Workflow, version: WorkflowVersion) {
    this.alertService.start(`Exporting workflow ${workflow.workflowName} version ${version.name} to ORCID`);
    this.entriesService.exportToORCID(workflow.id, version.id).pipe(
      map((result) => {
        this.alertService.detailedSuccess(`Exported workflow ${workflow.workflowName} version ${version.name} to ORCID`);
      }),
      catchError((error) => {
        this.alertService.detailedError(error);
        return EMPTY;
      })
    );
  }
}
