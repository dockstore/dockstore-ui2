import { Injectable } from '@angular/core';

import { WorkflowsService } from './swagger/api/workflows.service';
import { Workflow } from './swagger/model/workflow';

@Injectable()
export class CheckerWorkflowService {
    constructor(private workflowsService: WorkflowsService) { }

    getCheckWorkflowPath(id: number) {
        if (id) {
            this.workflowsService.getWorkflow(id).subscribe((workflow: Workflow) => {
                return workflow.path;
            }, error => {
                return null;
            });
        } else {
            return null;
        }
    }
}
