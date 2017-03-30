import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchContainersComponent } from './display-containers/search-containers/search-containers.component';
import { ContainerComponent } from './display-containers/container/container.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' },
  { path: 'containers', loadChildren: 'app/display-containers/display-containers.module#DisplayContainersModule' },
  { path: 'workflows', component: SearchWorkflowsComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
