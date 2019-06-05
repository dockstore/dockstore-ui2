import { RouterModule, Routes } from '@angular/router';
import { WorkflowClass } from 'app/shared/enum/workflow-class';
import { WorkflowsComponent } from '../workflows.component';
import { WorkflowComponent } from 'app/workflow/workflow.component';
import { SearchWorkflowsComponent } from '../search/search.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowsComponent,
    data: { title: 'Dockstore | Service', workflowClass: WorkflowClass.Service },
    children: [
      { path: '', component: SearchWorkflowsComponent, data: { title: 'Dockstore | Services', workflowClass: WorkflowClass.Service } },
      { path: '**', component: WorkflowComponent, data: { title: 'Dockstore | Service', workflowClass: WorkflowClass.Service } }
    ]
  }
];

export const ServicesRoutes = RouterModule.forChild(routes);
