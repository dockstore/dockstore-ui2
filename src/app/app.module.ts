/* Angular Modules */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

/* External Modules */
import { DataTablesModule } from 'angular-datatables';
import { Ng2UiAuthModule } from 'ng2-ui-auth';

/* External Services */
import { AuthService } from 'ng2-ui-auth';

/* Internal Modules */
import { HeaderModule } from './shared/header.module';
import { ListContainersModule } from './shared/list-containers.module';
import { ListWorkflowsModule } from './shared/list-workflows.module';
import { TabsModule } from './shared/tabs.module';

/* Internal Services */
import { DockstoreService } from './shared/dockstore.service';
import { HttpService } from './shared/http.service';
import { TrackLoginService } from './shared/track-login.service';
import { TokenService } from './loginComponents/token.service';
import { UserService } from './loginComponents/user.service';
import { LoginApi } from './login/login.api';
import { LoginService } from './login/login.service';
import { LogoutService } from './shared/logout.service';

/* Miscellaneous */
import { routing, CLIENT_ROUTER_PROVIDERS } from './app.routing';
import { AuthConfig } from './shared/auth.model';

/* Components */
import { AppComponent } from './app.component';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { SearchWorkflowsComponent } from './search-workflows/search-workflows.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { ToolDetailsComponent } from './tool-details/tool-details.component';

import { LoginComponent } from './login/login.component';

import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { AccountsExternalComponent } from './loginComponents/accounts/external/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';


@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    SearchWorkflowsComponent,
    HomeFootNoteComponent,
    ToolDetailsComponent,
    LoginComponent,
    OnboardingComponent,
    AccountsExternalComponent,
    AuthComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTablesModule,
    Ng2UiAuthModule.forRoot(AuthConfig),
    HeaderModule,
    ListContainersModule,
    ListWorkflowsModule,
    TabsModule,
    routing
  ],
  providers: [
    AuthService,
    LoginApi,
    LoginService,
    LogoutService,
    DockstoreService,
    HttpService,
    TrackLoginService,
    TokenService,
    UserService,
    CLIENT_ROUTER_PROVIDERS
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
