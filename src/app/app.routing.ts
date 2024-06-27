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
import { AboutComponent } from './about/about.component';
import { FundingComponent } from './funding/funding.component';
import { GithubCallbackComponent } from './github-callback/github-callback.component';
import { GithubLandingPageComponent } from './github-landing-page/github-landing-page.component';
import { DashboardComponent } from './home-page/dashboard/dashboard.component';
import { HomeComponent } from './home-page/home-logged-out/home.component';
import { LoginComponent } from './login/login.component';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { QuickStartComponent } from './loginComponents/onboarding/quickstart.component';
import { LogoutComponent } from './logout/logout.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { AuthGuard } from './shared/auth.guard';
import { SitemapComponent } from './sitemap/sitemap.component';
import { StarredEntriesComponent } from './starredentries/starredentries.component';

export const CLIENT_ROUTER_PROVIDERS = [AuthGuard];

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full', data: { title: 'Dockstore' } },
  {
    path: 'dashboard',
    component: DashboardComponent,
    data: { title: 'Dockstore | Dashboard' },
    canActivate: [AuthGuard],
  },
  {
    path: 'docs',
    loadChildren: () => import('app/docs/docs.routing').then((m) => m.docsRouting),
    data: { title: 'Dockstore | Documentation' },
  },
  {
    path: 'search-containers',
    loadChildren: () => import('app/containers/containers.routing').then((m) => m.containersRouting),
    data: { title: 'Dockstore | Tools' },
  },
  {
    path: 'containers',
    loadChildren: () => import('app/containers/containers.routing').then((m) => m.containersRouting),
    data: { title: 'Dockstore | Tools' },
  },
  {
    path: 'tools',
    loadChildren: () => import('app/containers/containers.routing').then((m) => m.containersRouting),
    data: { title: 'Dockstore | Tools' },
  },
  {
    path: 'workflows',
    loadChildren: () => import('app/workflows/workflows.routing').then((m) => m.workflowsRouting),
    data: { title: 'Dockstore | Workflows' },
  },
  {
    path: 'services',
    loadChildren: () => import('app/workflows/services/services.routing').then((m) => m.ServicesRoutes),
    data: { title: 'Dockstore | Services' },
  },
  {
    path: 'apptools',
    loadChildren: () => import('app/workflows/apptools/apptools.routing').then((m) => m.AppToolsRoutes),
    data: { title: 'Dockstore | App Tools' },
  },
  {
    path: 'notebooks',
    loadChildren: () => import('app/workflows/notebooks/notebooks.routing').then((m) => m.NotebooksRoutes),
    data: { title: 'Dockstore | Notebooks' },
  },
  {
    path: 'search-workflows',
    loadChildren: () => import('app/workflows/workflows.routing').then((m) => m.workflowsRouting),
    data: { title: 'Dockstore | Workflows' },
  },
  { path: 'organizations', loadChildren: () => import('app/organizations/organizations.routing').then((m) => m.OrganizationsRouting) },
  {
    path: 'my-tools',
    loadChildren: () => import('app/mytools/mytools.routing').then((m) => m.mytoolsRouting),
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Tools' },
  },
  {
    path: 'my-workflows',
    loadChildren: () => import('app/myworkflows/myworkflows.routing').then((m) => m.myworkflowRouting),
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Workflows' },
  },
  {
    path: 'my-services',
    loadChildren: () => import('app/my-services/my-services.routing').then((m) => m.MyServicesRoutes),
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Services' },
  },
  {
    path: 'my-notebooks',
    loadChildren: () => import('app/my-notebooks/my-notebooks.routing').then((m) => m.MyNotebooksRoutes),
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | My Notebooks' },
  },
  { path: 'githubCallback', component: GithubCallbackComponent },
  {
    path: 'aliases',
    loadChildren: () => import('app/aliases/aliases.routing').then((m) => m.AliasesRouting),
    data: { title: 'Dockstore | Aliases' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { title: 'Dockstore | About' },
  },
  {
    path: 'search',
    loadChildren: () => import('app/search/search.routing').then((m) => m.searchRouting),
    data: { title: 'Dockstore | Search' },
  },
  { path: 'register', component: LoginComponent, data: { title: 'Dockstore | Register' } },
  { path: 'login', component: LoginComponent, data: { title: 'Dockstore | Login' } },
  { path: 'logout', component: LogoutComponent, data: { title: 'Dockstore | Logout' } },
  { path: 'session-expired', component: SessionExpiredComponent, data: { title: 'Dockstore | Session Expired' } },
  { path: 'quick-start', component: QuickStartComponent, data: { title: 'Dockstore | Quick Start' } },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Onboarding' } },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard], data: { title: 'Dockstore | Accounts' } },
  { path: 'auth/:provider', component: AuthComponent },
  {
    path: 'starred',
    component: StarredEntriesComponent,
    canActivate: [AuthGuard],
    data: { title: 'Dockstore | Starred Tools, Workflows & Organizations' },
  },
  { path: 'maintenance', component: MaintenanceComponent, data: { title: 'Dockstore | Maintenance' } },
  { path: 'funding', component: FundingComponent, data: { title: 'Dockstore | Funding' } },
  { path: 'sitemap', component: SitemapComponent, data: { title: 'Dockstore | Sitemap' } },
  { path: 'github-landing-page', component: GithubLandingPageComponent, data: { title: 'Dockstore | GitHub Apps Landing Page' } },
  { path: 'users', loadChildren: () => import('app/user-page/user-page.routing').then((m) => m.UserPageRouting) },
  {
    path: '**',
    component: PageNotFoundComponent,
    data: { title: 'Dockstore | 404 Page Not Found' },
  },
];

export const routing = RouterModule.forRoot(APP_ROUTES, {
  scrollPositionRestoration: 'enabled',
  anchorScrolling: 'enabled',
});
