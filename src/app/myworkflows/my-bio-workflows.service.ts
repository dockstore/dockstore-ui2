import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { forkJoin, of as observableOf } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { WorkflowService } from '../shared/state/workflow.service';
import { SharedWorkflows, UsersService, Workflow, WorkflowsService } from '../shared/swagger';

@Injectable()
export class MyBioWorkflowsService {
  constructor(
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private location: Location,
    private usersService: UsersService,
    private alertService: AlertService,
    private myEntryService: MyEntriesStateService
  ) {}
  selectEntry(id: number, includesValidation: string) {
    this.workflowsService.getWorkflow(id, includesValidation).subscribe((result: Workflow) => {
      this.location.go('/my-workflows/' + result.full_workflow_path);
      this.workflowService.setWorkflow(<BioWorkflow>result);
    });
  }
}
