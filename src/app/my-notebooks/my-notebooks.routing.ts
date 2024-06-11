import { Routes } from '@angular/router';
import { MyWorkflowComponent } from '../myworkflows/my-workflow/my-workflow.component';
import { EntryType } from '../shared/enum/entry-type';

const routes: Routes = [
  {
    path: '**',
    component: MyWorkflowComponent,
    data: { title: 'Dockstore | My Notebooks', entryType: EntryType.Notebook },
  },
];

export const MyNotebooksRoutes = routes;
