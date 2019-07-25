import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { forkJoin, of as observableOf } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class MyServicesService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private location: Location,
    private usersService: UsersService,
    protected userQuery: UserQuery,
    private myEntryService: MyEntriesStateService
  ) {}
  selectEntry(id: number, includesValidation: string) {
    this.workflowsService.getWorkflow(id, includesValidation).subscribe((service: Workflow) => {
      this.location.go('/my-services/' + service.full_workflow_path);
      this.workflowService.setWorkflow(service);
    });
  }

  getMyServices(id: number): void {
    this.alertService.start('Fetching services');
    this.myEntryService.setRefreshingMyEntries(true);
    forkJoin(
      this.usersService.userServices(id).pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertService.detailedSnackBarError(error);
          return observableOf([]);
        })
      ),
      this.workflowsService.sharedWorkflows().pipe(
        catchError((error: HttpErrorResponse) => {
          this.alertService.detailedSnackBarError(error);
          return observableOf([]);
        })
      )
    )
      .pipe(
        finalize(() => {
          this.alertService.simpleSuccess();
          this.myEntryService.setRefreshingMyEntries(false);
        })
      )
      .subscribe(
        ([workflows, sharedWorkflows]) => {
          this.workflowService.setWorkflows(workflows);
          this.workflowService.setSharedWorkflows(sharedWorkflows);
        },
        error => {
          console.error('This should be impossible because both errors are caught already');
        }
      );
  }
}
