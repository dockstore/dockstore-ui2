/* Angular Modules */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* External Modules */
import { DataTablesModule } from 'angular-datatables';
/* External Services */
import { AuthService, Ng2UiAuthModule } from 'ng2-ui-auth';
/* Components */
import { AppComponent } from './app.component';
/* Miscellaneous */
import { CLIENT_ROUTER_PROVIDERS, routing } from './app.routing';
import { FooterComponent } from './footer/footer.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { HomeComponent } from './home/home.component';
import { LoginApi } from './login/login.api';

import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { AccountsExternalComponent } from './loginComponents/accounts/external/accounts.component';
import { AccountsInternalComponent } from './loginComponents/accounts/internal/accounts.component';
import { AuthComponent } from './loginComponents/auth/auth.component';

import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { TokenService } from './loginComponents/token.service';
import { TokensComponent } from './loginComponents/tokens/tokens.component';
import { UserService } from './loginComponents/user.service';
import { NavbarComponent } from './navbar/navbar.component';
import { AuthConfig } from './shared/auth.model';
import { CommunicatorService } from './shared/communicator.service';
import { DateService } from './shared/date.service';

/* Internal Services */
import { DockstoreService } from './shared/dockstore.service';
import { HttpService } from './shared/http.service';
import { ImageProviderService } from './shared/image-provider.service';
import { ListService } from './shared/list.service';
import { LogoutService } from './shared/logout.service';
/* Internal Modules */
import { HeaderModule } from './shared/modules/header.module';
import { ListContainersModule } from './shared/modules/list-containers.module';
import { ListWorkflowsModule } from './shared/modules/list-workflows.module';
import { TabModule } from './shared/modules/tabs.module';
import { ProviderService } from './shared/provider.service';
import { ToolService } from './shared/tool.service';
import { TrackLoginService } from './shared/track-login.service';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { ToolDetailsComponent } from './tool-details/tool-details.component';

@NgModule({
  declarations: [
    AppComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    HomeFootNoteComponent,
    ToolDetailsComponent,
    LoginComponent,
    OnboardingComponent,
    AccountsComponent,
    AccountsInternalComponent,
    AccountsExternalComponent,
    AuthComponent,
    TokensComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    DataTablesModule.forRoot(),
    Ng2UiAuthModule.forRoot(AuthConfig),
    HeaderModule,
    ListContainersModule,
    ListWorkflowsModule,
    TabModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    routing
  ],
  providers: [
    AuthService,
    LoginApi,
    LoginService,
    LogoutService,
    DockstoreService,
    DateService,
    HttpService,
    TrackLoginService,
    TokenService,
    UserService,
    ListService,
    CommunicatorService,
    ToolService,
    ProviderService,
    ImageProviderService,
    CLIENT_ROUTER_PROVIDERS
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
