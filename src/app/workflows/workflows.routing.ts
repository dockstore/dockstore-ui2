import { RouterModule, Routes } from '@angular/router';

import { WorkflowsComponent } from './workflows.component';
import { SearchWorkflowsComponent } from './search/search.component';
import { WorkflowComponent } from './workflow/workflow.component';

const WORKFLOWS_ROUTES: Routes = [
  {
    path: '', component: WorkflowsComponent, children: [
      { path: '', component: SearchWorkflowsComponent },
      { path: '**', component: WorkflowComponent }
    ]
  }
];

export const workflowsRouting = RouterModule.forChild(WORKFLOWS_ROUTES);
