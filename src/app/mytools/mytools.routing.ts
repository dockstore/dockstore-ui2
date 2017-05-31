import { RouterModule, Routes } from '@angular/router';

import { MyToolsComponent } from './mytools.component';
import { ContainerComponent } from '../container/container.component';

const MYTOOLS_ROUTES: Routes = [
  {
    path: '', component: MyToolsComponent
  }
];
export const mytoolsRouting = RouterModule.forChild(MYTOOLS_ROUTES);
