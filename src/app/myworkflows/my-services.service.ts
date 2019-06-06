import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { Workflow, WorkflowsService, UsersService } from 'app/shared/swagger';
import { forkJoin, combineLatest, of as observableOf } from 'rxjs';
import { MyEntriesService } from 'app/shared/myentries.service';
import { catchError, finalize, takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { UserQuery } from 'app/shared/user/user.query';
import { WorkflowQuery } from 'app/shared/state/workflow.query';
import { MyWorkflowsService } from './myworkflows.service';

@Injectable({
  providedIn: 'root'
})
export class MyServicesService extends MyEntriesService {
  constructor(
    private alertService: AlertService,
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private location: Location,
    private usersService: UsersService,
    protected userQuery: UserQuery,
    private workflowQuery: WorkflowQuery,
    private myWorkflowsService: MyWorkflowsService
  ) {
    super();
  }
  selectEntry(id: number, includesValidation: string) {
    this.workflowsService.getWorkflow(id, includesValidation).subscribe((service: Workflow) => {
      this.location.go('/my-services/' + service.full_workflow_path);
      this.workflowService.setWorkflow(service);
    });
  }

  getGroupIndex(groupEntries: any[], group: string): number {
    return this.myWorkflowsService.getGroupIndex(groupEntries, group);
  }

  getMyEntries() {
    combineLatest(this.userQuery.user$, this.workflowQuery.entryType$)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(([user, entryType]) => {
        if (user) {
          this.alertService.start('Fetching ' + entryType + 's');
          this.getMyServices(user.id);
        }
      });
  }

  getMyServices(id: number): void {
    forkJoin(
      this.usersService.userWorkflows(id).pipe(
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
        finalize(() => this.alertService.simpleSuccess()),
        takeUntil(this.ngUnsubscribe)
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

  registerEntry(): void {}
}
