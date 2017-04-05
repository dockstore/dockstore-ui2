import { RouterModule, Routes } from '@angular/router';

import { ContainersComponent } from './containers.component';
import { SearchContainersComponent } from './search/search.component';
import { ContainerComponent } from './container/container.component';

const CONTAINERS_ROUTES: Routes = [
  {
    path: '', component: ContainersComponent, children: [
      { path: '', component: SearchContainersComponent },
      { path: '**', component: ContainerComponent }
    ]
  }
];

export const containersRouting = RouterModule.forChild(CONTAINERS_ROUTES);
