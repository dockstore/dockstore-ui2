import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/auth.guard';

import { HomeComponent } from './home/home.component';
import { SearchContainersComponent } from './containers/search/search.component';
import { ContainerComponent } from './container/container.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';
import { LoginComponent } from './login/login.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { TokensComponent } from './loginComponents/tokens/tokens.component';

export const CLIENT_ROUTER_PROVIDERS = [ AuthGuard ];

const APP_ROUTES: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'docs', loadChildren: 'app/docs/docs.module#DocsModule' },
  { path: 'containers', loadChildren: 'app/containers/containers.module#ContainersModule' },
  { path: 'workflows', loadChildren: 'app/workflows/workflows.module#WorkflowsModule' },
  { path: 'login', component: LoginComponent },
  { path: 'onboarding', component: OnboardingComponent, canActivate: [AuthGuard] },
  { path: 'accounts', component: AccountsComponent, canActivate: [AuthGuard] },
  { path: 'auth/:provider', component: AuthComponent },
  { path: 'tokens', component: TokensComponent },
  { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(APP_ROUTES);
