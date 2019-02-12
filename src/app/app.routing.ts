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
import { QuickStartComponent } from './loginComponents/onboarding/quickstart.component';
import { FundingComponent } from './funding/funding.component';
import { SitemapComponent } from './sitemap/sitemap.component';

export const CLIENT_ROUTER_PROVIDERS = [ AuthGuard ];

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Dockstore'} },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule', data: { title: 'Dockstore | Documentation'} },
  { path: 'search-containers', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools'} },
  { path: 'containers', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools'} },
  { path: 'tools', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools'} },
  { path: 'workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule', data: { title: 'Dockstore | Workflows'} },
  { path: 'search-workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule', data: { title: 'Dockstore | Workflows'} },
  { path: 'organizations', loadChildren: 'app/organizations/organizations.module#OrganizationsModule'},
  { path: 'my-tools', loadChildren: 'app/mytools/mytools.module#MyToolsModule', canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Tools'}},
  { path: 'my-workflows', loadChildren: 'app/myworkflows/myworkflows.module#MyWorkflowsModule', canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Workflows'}},
  { path: 'search*', component: SearchComponent, data: { title: 'Dockstore | Search'} },
  { path: 'login', component: LoginComponent, data: { title: 'Dockstore | Login'} },
  { path: 'quick-start', component: QuickStartComponent, data: { title: 'Dockstore | Quick Start'} },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Onboarding'} },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Accounts'} },
  { path: 'auth/:provider', component: AuthComponent },
  { path: 'starred', component: StarredEntriesComponent, data: { title: 'Dockstore | Starred Tools & Workflows'}},
  { path: 'maintenance', component: MaintenanceComponent, data: { title: 'Dockstore | Maintenance'}  },
  { path: 'funding', component: FundingComponent, data: { title: 'Dockstore | Funding'} },
  { path: 'sitemap', component: SitemapComponent, data: { title: 'Dockstore | Sitemap'} },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
