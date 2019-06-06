import { RouterModule, Routes } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowComponent } from 'app/workflow/workflow.component';
import { SearchWorkflowsComponent } from '../search/search.component';
import { WorkflowsComponent } from '../workflows.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowsComponent,
    data: { title: 'Dockstore | Service', entryType: EntryType.Service },
    children: [
      { path: '', component: SearchWorkflowsComponent, data: { title: 'Dockstore | Services' } },
      { path: '**', component: WorkflowComponent, data: { title: 'Dockstore | Service' } }
    ]
  }
];

export const ServicesRoutes = RouterModule.forChild(routes);
