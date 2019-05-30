import { RouterModule, Routes } from '@angular/router';
import { MyWorkflowComponent } from '../myworkflows/my-workflow/my-workflow.component';
import { ToolClass } from '../shared/enum/tool-class';

const routes: Routes = [
  {
    path: '**', component: MyWorkflowComponent, data: { title: 'Dockstore | My Services', toolClass: ToolClass.Service }
  },
];

export const MyServicesRoutes = RouterModule.forChild(routes);
