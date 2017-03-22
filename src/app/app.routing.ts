import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
