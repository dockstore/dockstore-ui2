import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { AlertService } from 'app/shared/alert/state/alert.service';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { UsersService, Workflow, WorkflowsService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';
import { finalize } from 'rxjs/operators';

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
    this.usersService
      .userServices(id)
      .pipe(
        finalize(() => {
          this.myEntryService.setRefreshingMyEntries(false);
        })
      )
      .subscribe(
        (services: Array<Workflow>) => {
          this.workflowService.setWorkflows(services);
          this.workflowService.setSharedWorkflows([]);
          this.alertService.simpleSuccess();
        },
        error => {
          this.workflowService.setWorkflows([]);
          this.workflowService.setSharedWorkflows([]);
          this.alertService.detailedSnackBarError(error);
        }
      );
  }
}
