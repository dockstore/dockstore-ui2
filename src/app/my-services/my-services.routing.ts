import { RouterModule, Routes } from '@angular/router';
import { MyWorkflowComponent } from '../myworkflows/my-workflow/my-workflow.component';
import { WorkflowClass } from '../shared/enum/workflow-class';

const routes: Routes = [
  {
    path: '**', component: MyWorkflowComponent, data: { title: 'Dockstore | My Services', workflowClass: WorkflowClass.Service }
  },
];

export const MyServicesRoutes = RouterModule.forChild(routes);
