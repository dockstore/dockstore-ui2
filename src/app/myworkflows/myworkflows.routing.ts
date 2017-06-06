import { RouterModule, Routes } from '@angular/router';

import { MyWorkflowsComponent } from './myworkflows.component';

const MYTOOLS_ROUTES: Routes = [
  {
    path: '', component: MyWorkflowsComponent
  }
];
export const myworkflowRouting = RouterModule.forChild(MYTOOLS_ROUTES);
