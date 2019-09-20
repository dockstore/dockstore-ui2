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
import { FundingComponent } from './funding/funding.component';
import { GithubCallbackComponent } from './github-callback/github-callback.component';
import { HomeLoggedInComponent } from './home-page/home-logged-in/home-logged-in.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginComponent } from './login/login.component';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { QuickStartComponent } from './loginComponents/onboarding/quickstart.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { AuthGuard } from './shared/auth.guard';
import { SitemapComponent } from './sitemap/sitemap.component';
import { StarredEntriesComponent } from './starredentries/starredentries.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';

export const CLIENT_ROUTER_PROVIDERS = [AuthGuard];

const APP_ROUTES: Routes = [
  { path: '', component: HomePageComponent, pathMatch: 'full', data: { title: 'Dockstore' } },
  { path: 'beta-homepage', component: HomeLoggedInComponent, pathMatch: 'full', data: { title: 'Dockstore' } },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule', data: { title: 'Dockstore | Documentation' } },
  { path: 'search-containers', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools' } },
  { path: 'containers', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools' } },
  { path: 'tools', loadChildren: 'app/containers/containers.module#ContainersModule', data: { title: 'Dockstore | Tools' } },
  { path: 'workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule', data: { title: 'Dockstore | Workflows' } },
  {
    path: 'services',
    loadChildren: 'app/workflows/services/services.module#ServicesModule',
    data: { title: 'Dockstore | Services' }
  },
  { path: 'search-workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule', data: { title: 'Dockstore | Workflows' } },
  { path: 'organizations', loadChildren: 'app/organizations/organizations.module#OrganizationsModule' },
  {
    path: 'my-tools',
    loadChildren: 'app/mytools/mytools.module#MyToolsModule',
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Tools' }
  },
  {
    path: 'my-workflows',
    loadChildren: 'app/myworkflows/myworkflows.module#MyWorkflowsModule',
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Workflows' }
  },
  {
    path: 'my-services',
    loadChildren: 'app/my-services/my-services.module#MyServicesModule',
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Services' }
  },
  { path: 'githubCallback', component: GithubCallbackComponent },
  { path: 'aliases', loadChildren: 'app/aliases/aliases.module#AliasesModule', data: { title: 'Dockstore | Aliases' } },
  {
    path: 'search',
    loadChildren: 'app/search/search.module#SearchModule',
    data: { title: 'Dockstore | Search' }
  },
  { path: 'login', component: LoginComponent, data: { title: 'Dockstore | Login' } },
  { path: 'session-expired', component: SessionExpiredComponent, data: { title: 'Dockstore | Session Expired' } },
  { path: 'quick-start', component: QuickStartComponent, data: { title: 'Dockstore | Quick Start' } },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Onboarding' } },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Accounts' } },
  { path: 'auth/:provider', component: AuthComponent },
  { path: 'starred', component: StarredEntriesComponent, data: { title: 'Dockstore | Starred Tools & Workflows' } },
  { path: 'maintenance', component: MaintenanceComponent, data: { title: 'Dockstore | Maintenance' } },
  { path: 'funding', component: FundingComponent, data: { title: 'Dockstore | Funding' } },
  { path: 'sitemap', component: SitemapComponent, data: { title: 'Dockstore | Sitemap' } },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' });
