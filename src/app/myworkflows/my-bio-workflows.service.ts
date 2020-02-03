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

  /**
   * Very strange function that gets both the user's workflows and the user's shared workflows
   * If one of them errors, the other should still continue executing.  This is done by catching it.
   * Once both of them finish, the error is determined whether the type is Array (which is normal) or not (which means HttpErrorResponse
   * If both errors, then only the user's workflows error message is displayed
   *
   * @param {number} id  The user ID
   * @memberof MyBioWorkflowsService
   */
  getMyBioWorkflows(id: number): void {
    this.alertService.start('Fetching workflows');
    this.myEntryService.setRefreshingMyEntries(true);
    forkJoin([
      this.usersService.userWorkflows(id).pipe(
        catchError((error: HttpErrorResponse) => {
          return observableOf(error);
        })
      ),
      this.workflowsService.sharedWorkflows().pipe(
        catchError((error: HttpErrorResponse) => {
          return observableOf(error);
        })
      )
    ])
      .pipe(
        finalize(() => {
          this.alertService.simpleSuccess();
          this.myEntryService.setRefreshingMyEntries(false);
        })
      )
      .subscribe(
        ([workflows, sharedWorkflows]: [(Array<BioWorkflow> | HttpErrorResponse), (Array<SharedWorkflows> | HttpErrorResponse)]) => {
          if (!Array.isArray(workflows) && !Array.isArray(sharedWorkflows)) {
            this.alertService.detailedSnackBarError(workflows);
            workflows = [];
            sharedWorkflows = [];
          } else {
            if (!Array.isArray(workflows)) {
              this.alertService.detailedSnackBarError(workflows);
              workflows = [];
            }
            if (!Array.isArray(sharedWorkflows)) {
              this.alertService.detailedSnackBarError(sharedWorkflows);
              sharedWorkflows = [];
            }
          }
          this.workflowService.setWorkflows(workflows);
          this.workflowService.setSharedWorkflows(sharedWorkflows);
        },
        error => {
          console.error('This should be impossible because both errors are caught already');
        }
      );
  }
}
