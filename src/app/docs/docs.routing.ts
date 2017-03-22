import { RouterModule, Routes } from '@angular/router';

import { DocsComponent } from './docs.component';
import { MainComponent } from './main/main.component';
import { PageComponent } from './page/page.component';

const DOC_ROUTES: Routes = [
  {
    path: '', component: DocsComponent, children: [
      { path: '', component: MainComponent },
      { path: ':slug', component: PageComponent }
    ]
  }
];

export const docsRouting = RouterModule.forChild(DOC_ROUTES);
