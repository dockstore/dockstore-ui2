import { Injectable } from '@angular/core';
import { AlertService } from '../../alert/state/alert.service';
import { Doi, Workflow, WorkflowsService } from '../../openapi';
import { WorkflowService } from '../../state/workflow.service';

@Injectable()
export class ManageDoisDialogService {
  constructor(private alertService: AlertService, private workflowsService: WorkflowsService, private workflowService: WorkflowService) {}

  saveDoiSelection(entry: Workflow, doiSelection: Doi.InitiatorEnum) {
    this.alertService.start('Saving DOI selection');
    const newEntryForUpdate = { ...entry, doiSelection: doiSelection };

    this.workflowsService.updateWorkflow(entry.id, newEntryForUpdate).subscribe(
      (response) => {
        this.alertService.detailedSuccess();
        const newDoiSelection = response.doiSelection;
        this.workflowService.updateDoiSelection(newDoiSelection);
      },
      (error) => {
        this.alertService.detailedError(error);
      }
    );
  }
}
