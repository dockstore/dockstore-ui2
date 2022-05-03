import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './user-page.component';

const USERPAGE_ROUTES: Routes = [
  { path: ':username', component: UserPageComponent, data: { title: 'Dockstore | User' } },
  { path: '**', redirectTo: '' },
];

export const UserPageRouting = RouterModule.forChild(USERPAGE_ROUTES);
