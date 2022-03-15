import { RouterModule, Routes } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowComponent } from 'app/workflow/workflow.component';
import { SearchWorkflowsComponent } from '../search/search.component';
import { WorkflowsComponent } from '../workflows.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowsComponent,
    data: { title: 'Dockstore | App Tool', entryType: EntryType.AppTool },
    children: [
      { path: '', component: SearchWorkflowsComponent, data: { title: 'Dockstore | App Tools' } },
      { path: '**', component: WorkflowComponent, data: { title: 'Dockstore | App Tools' } },
    ],
  },
];

export const AppToolsRoutes = RouterModule.forChild(routes);
