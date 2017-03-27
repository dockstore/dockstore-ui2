import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SearchContainersComponent } from './search-containers/search-containers.component';

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' },
  { path: 'search-containers', component: SearchContainersComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
