import { MaintenanceComponent } from './maintenance/maintenance.component';
/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { SearchComponent } from './search/search.component';
import { StarredEntriesComponent } from './starredentries/starredentries.component';

export const CLIENT_ROUTER_PROVIDERS = [ AuthGuard ];

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' },
  { path: 'search-containers', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'containers', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'tools', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule' },
  { path: 'search-workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule' },
  { path: 'my-tools', loadChildren: 'app/mytools/mytools.module#MyToolsModule', canActivate: [AuthGuard] },
  { path: 'my-workflows', loadChildren: 'app/myworkflows/myworkflows.module#MyWorkflowsModule', canActivate: [AuthGuard] },
  { path: 'search*', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'auth/:provider', component: AuthComponent },
  { path: 'starred', component: StarredEntriesComponent },
  { path: 'maintenance', component: MaintenanceComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
