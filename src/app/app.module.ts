import { ToasterModule } from './shared/toaster/toaster.module';
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

import { RefreshOrganizationComponent } from './shared/refresh-organization/refresh-organization.component';
import { ContainerService } from './shared/container.service';
import { WorkflowService } from './shared/workflow.service';
import { Dockstore } from './shared/dockstore.model';
import { Configuration } from './shared/swagger/configuration';
import { ApiModule } from './shared/swagger/api.module';
import { StateService } from './shared/state.service';
/* Angular Modules */
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
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
import { ImageProviderService } from './shared/image-provider.service';
import { ListService } from './shared/list.service';
import { LogoutService } from './shared/logout.service';
import { PagenumberService } from './shared/pagenumber.service';
import { SearchService } from './search/search.service';
import { TwitterService } from './shared/twitter.service';
/* Internal Modules */
import { HeaderModule } from './shared/modules/header.module';
import { ListContainersModule } from './shared/modules/list-containers.module';
import { ListWorkflowsModule } from './shared/modules/list-workflows.module';
import { ProviderService } from './shared/provider.service';
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
import { SearchModule } from './search/search.module';
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
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    DataTablesModule.forRoot(),
    Ng2UiAuthModule.forRoot(AuthConfig),
    HeaderModule,
    ListContainersModule,
    ListWorkflowsModule,
    BsDropdownModule.forRoot(),
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ClipboardModule,
    OrderByModule,
    ToasterModule,
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
    LoginService,
    LogoutService,
    DockstoreService,
    DateService,
    TrackLoginService,
    TokenService,
    UserService,
    ListService,
    CommunicatorService,
    ProviderService,
    ContainerService,
    WorkflowService,
    ImageProviderService,
    CLIENT_ROUTER_PROVIDERS,
    StateService,
    SearchService,
    PagenumberService,
    TwitterService,
    ContainerService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

export const apiConfig = new Configuration({
  apiKeys: {},
  basePath: Dockstore.API_URI
});

export function getApiConfig() {
  return apiConfig;
}
