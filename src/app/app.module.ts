import { SearchModule } from './search/search.module';
import { Configuration } from './shared/swagger/configuration';
import { ApiModule } from './shared/swagger/api.module';
import { StateService } from './shared/state.service';
/* Angular Modules */
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { FlexLayoutModule } from '@angular/flex-layout';


/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule} from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* External Modules */
import { DataTablesModule } from 'angular-datatables';
import { ClipboardModule } from 'ngx-clipboard';
import { TagCloudModule } from 'angular-tag-cloud-module';
import { MarkdownModule } from 'angular2-markdown';
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
import { UsersWebService } from './shared/webservice/users-web.service';
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
import { VersionsService } from './footer/versions.service';
import { TwitterService } from './shared/twitter.service';
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
import { OrderByModule } from './shared/modules/orderby.module';
import { StarredEntriesComponent } from './starredentries/starredentries.component';
import { StarringModule } from './starring/starring.module';
import { StargazersModule } from './stargazers/stargazers.module';
import { ListentryModule } from './listentry/listentry.module';
import { DownloadCLIClientComponent } from './loginComponents/onboarding/downloadcliclient/downloadcliclient.component';
import { SetupCompleteComponent } from './loginComponents/onboarding/setupcomplete/setupcomplete.component';

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
    TokensComponent,
    StarredEntriesComponent,
    DownloadCLIClientComponent,
    SetupCompleteComponent
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
    ClipboardModule,
    OrderByModule,
    FlexLayoutModule,
    StarringModule,
    routing,
    ModalModule.forRoot(),
    StargazersModule,
    ListentryModule,
    MarkdownModule.forRoot(),
    SearchModule,
    ApiModule.forConfig(getApiConfig)
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
    CLIENT_ROUTER_PROVIDERS,
    StateService,
    UsersWebService,
    SearchService,
    VersionsService,
    TwitterService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

export const apiConfig = new Configuration({
  accessToken: '',
  basePath: ''
});

export function getApiConfig() {
  return apiConfig;
}
