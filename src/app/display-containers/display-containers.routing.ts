import { RouterModule, Routes } from '@angular/router';

import { DisplayContainersComponent } from './display-containers.component';
import { SearchContainersComponent } from './search-containers/search-containers.component';
import { ContainerComponent } from './container/container.component';

const CONTAINERS_ROUTES: Routes = [
  {
    path: '', component: DisplayContainersComponent, children: [
      { path: '', component: SearchContainersComponent },
      { path: '**', component: ContainerComponent }
    ]
  }
];

export const containersRouting = RouterModule.forChild(CONTAINERS_ROUTES);
