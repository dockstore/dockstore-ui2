import { RouterModule, Routes } from '@angular/router';
import { EntryType } from 'app/shared/enum/entry-type';
import { WorkflowComponent } from 'app/workflow/workflow.component';
import { SearchWorkflowsComponent } from '../search/search.component';
import { WorkflowsComponent } from '../workflows.component';

const routes: Routes = [
  {
    path: '',
    component: WorkflowsComponent,
    data: { title: 'Dockstore | Notebooks', entryType: EntryType.Notebook },
    children: [
      { path: '', component: SearchWorkflowsComponent, data: { title: 'Dockstore | Notebook' } },
      { path: '**', component: WorkflowComponent, data: { title: 'Dockstore | Notebook' } },
    ],
  },
];

export const NotebooksRoutes = RouterModule.forChild(routes);
