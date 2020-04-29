import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { BioWorkflow } from 'app/shared/swagger/model/bioWorkflow';
import { WorkflowService } from '../shared/state/workflow.service';
import { Workflow, WorkflowsService } from '../shared/swagger';

@Injectable()
export class MyBioWorkflowsService {
  constructor(private workflowsService: WorkflowsService, private workflowService: WorkflowService, private location: Location) {}
  selectEntry(id: number, includesValidation: string) {
    this.workflowsService.getWorkflow(id, includesValidation).subscribe((result: Workflow) => {
      this.location.go('/my-workflows/' + result.full_workflow_path);
      this.workflowService.setWorkflow(<BioWorkflow>result);
    });
  }
}
