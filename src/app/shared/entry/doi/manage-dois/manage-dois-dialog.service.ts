import { Injectable } from '@angular/core';
import { AlertService } from '../../../alert/state/alert.service';
import { Doi, Workflow, WorkflowsService } from '../../../openapi';
import { WorkflowService } from '../../../state/workflow.service';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { InfoTabService } from 'app/workflow/info-tab/info-tab.service';

@Injectable()
export class ManageDoisDialogService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private workflowQuery: WorkflowQuery,
    private infoTabService: InfoTabService
  ) {}

  saveDoiSelection(entry: Workflow, doiSelection: Doi.InitiatorEnum) {
    this.alertService.start('Saving DOI selection');
    const newEntryForUpdate = this.infoTabService.getPartialEntryForUpdate({ ...entry, doiSelection: doiSelection });

    this.workflowsService.updateWorkflow(entry.id, newEntryForUpdate).subscribe(
      (response) => {
        this.alertService.detailedSuccess();
        this.workflowService.setWorkflow({ ...this.workflowQuery.getActive(), doiSelection: response.doiSelection });
      },
      (error) => {
        this.alertService.detailedError(error);
      }
    );
  }
}
