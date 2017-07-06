import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { TokensComponent } from './loginComponents/tokens/tokens.component';
import { SearchComponent } from './search/search.component';
import { StarredentriesComponent } from './starredentries/starredentries.component';

export const CLIENT_ROUTER_PROVIDERS = [ AuthGuard ];

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' },
  { path: 'search-containers', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'containers', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'tools', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule' },
  { path: 'search-workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule' },
  { path: 'mytools', loadChildren: 'app/mytools/mytools.module#MyToolsModule' },
  { path: 'myworkflows', loadChildren: 'app/myworkflows/myworkflows.module#MyWorkflowsModule' },
  { path: 'admin-search', component: SearchComponent },
  { path: 'login', component: LoginComponent },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'auth/:provider', component: AuthComponent },
  { path: 'tokens', component: TokensComponent },
  { path: 'starred', component: StarredentriesComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
