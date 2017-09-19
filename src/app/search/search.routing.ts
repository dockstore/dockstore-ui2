import { RouterModule, Routes } from '@angular/router';

import { SearchComponent } from './search.component';

const CONTAINERS_ROUTES: Routes = [
  {
    path: 'search', component: SearchComponent, children: [
    { path: 'search?**', component: SearchComponent }
  ]
  }
];

export const searchRouting = RouterModule.forRoot(CONTAINERS_ROUTES);
