import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { WorkflowService } from 'app/shared/state/workflow.service';
import { Workflow, WorkflowsService } from 'app/shared/swagger';
import { UserQuery } from 'app/shared/user/user.query';

@Injectable()
export class MyServicesService {
  constructor(
    private workflowsService: WorkflowsService,
    private workflowService: WorkflowService,
    private location: Location,
    protected userQuery: UserQuery
  ) {}
  selectEntry(id: number, includesValidation: string) {
    this.workflowsService.getWorkflow(id, includesValidation).subscribe((service: Workflow) => {
      this.location.go('/my-services/' + service.full_workflow_path);
      this.workflowService.setWorkflow(service);
    });
  }
}
