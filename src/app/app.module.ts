/**
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
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MAT_TOOLTIP_DEFAULT_OPTIONS,
  MatSnackBarConfig,
  MatTooltipDefaultOptions,
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule, Title } from '@angular/platform-browser';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService, Ng2UiAuthModule } from 'ng2-ui-auth';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxMdModule } from 'ngx-md';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { CLIENT_ROUTER_PROVIDERS, routing } from './app.routing';
import { BannerComponent } from './banner/banner.component';
import { FooterComponent } from './footer/footer.component';
import { FundingComponent } from './funding/funding.component';
import { HomeFootNoteComponent } from './home-foot-note/home-foot-note.component';
import { HomeComponent, YoutubeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { ControlsComponent } from './loginComponents/accounts/controls/controls.component';
import {
  DeleteAccountDialogComponent,
} from './loginComponents/accounts/controls/delete-account-dialog/delete-account-dialog.component';
import { AccountsExternalComponent } from './loginComponents/accounts/external/accounts.component';
import { AccountsService } from './loginComponents/accounts/external/accounts.service';
import { GetTokenContentPipe } from './loginComponents/accounts/external/getTokenContent.pipe';
import { GetTokenUsernamePipe } from './loginComponents/accounts/external/getTokenUsername.pipe';
import { AccountsInternalComponent } from './loginComponents/accounts/internal/accounts.component';
import { ChangeUsernameComponent } from './loginComponents/accounts/internal/change-username/change-username.component';
import { AuthComponent } from './loginComponents/auth/auth.component';
import { DownloadCLIClientComponent } from './loginComponents/onboarding/downloadcliclient/downloadcliclient.component';
import { OnboardingComponent } from './loginComponents/onboarding/onboarding.component';
import { QuickStartComponent } from './loginComponents/onboarding/quickstart.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MetadataService } from './metadata/metadata.service';
import { NavbarComponent } from './navbar/navbar.component';
import { RegisterService } from './register/register.service';
import { SearchModule } from './search/search.module';
import { RefreshAlertModule } from './shared/alert/alert.module';
import { AuthConfig } from './shared/auth.model';
import { ContainerService } from './shared/container.service';
import { DateService } from './shared/date.service';
import { Dockstore } from './shared/dockstore.model';
import { DockstoreService } from './shared/dockstore.service';
import { DescriptorLanguageService } from './shared/entry/descriptor-language.service';
import { RegisterCheckerWorkflowService } from './shared/entry/register-checker-workflow/register-checker-workflow.service';
import { ExtendedToolsService } from './shared/extended-tools.service';
import { ExtendedWorkflowsService } from './shared/extended-workflows.service';
import { ImageProviderService } from './shared/image-provider.service';
import { ListService } from './shared/list.service';
import { LogoutService } from './shared/logout.service';
import { HeaderModule } from './shared/modules/header.module';
import { ListContainersModule } from './shared/modules/list-containers.module';
import { ListWorkflowsModule } from './shared/modules/list-workflows.module';
import { CustomMaterialModule } from './shared/modules/material.module';
import { OrderByModule } from './shared/modules/orderby.module';
import { PagenumberService } from './shared/pagenumber.service';
import { ProviderService } from './shared/provider.service';
import { RefreshService } from './shared/refresh.service';
import { ApiModule } from './shared/swagger/api.module';
import { GA4GHService } from './shared/swagger/api/gA4GH.service';
import { Configuration } from './shared/swagger/configuration';
import { getTooltipConfig } from './shared/tooltip';
import { TrackLoginService } from './shared/track-login.service';
import { TwitterService } from './shared/twitter.service';
import { UrlResolverService } from './shared/url-resolver.service';
import { VerifiedByService } from './shared/verified-by.service';
import { SponsorsComponent } from './sponsors/sponsors.component';
import { StargazersModule } from './stargazers/stargazers.module';
import { StarredEntriesComponent } from './starredentries/starredentries.component';
import { StarringModule } from './starring/starring.module';
import { SitemapComponent } from './sitemap/sitemap.component';
import { RequestsModule } from './loginComponents/requests.module';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

export const myCustomSnackbarDefaults: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom'
};

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DeleteAccountDialogComponent,
    SponsorsComponent,
    NavbarComponent,
    HomeComponent,
    FooterComponent,
    HomeFootNoteComponent,
    LoginComponent,
    OnboardingComponent,
    QuickStartComponent,
    AccountsComponent,
    AccountsInternalComponent,
    AccountsExternalComponent,
    AuthComponent,
    GetTokenUsernamePipe,
    GetTokenContentPipe,
    StarredEntriesComponent,
    DownloadCLIClientComponent,
    MaintenanceComponent,
    FundingComponent,
    BannerComponent,
    ChangeUsernameComponent,
    YoutubeComponent,
    SitemapComponent
],
  imports: [
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    FontAwesomeModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
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
    FlexLayoutModule,
    StarringModule,
    routing,
    ModalModule.forRoot(),
    StargazersModule,
    NgxMdModule.forRoot(),
    ReactiveFormsModule,
    SearchModule,
    ApiModule.forRoot(getApiConfig),
    CustomMaterialModule,
    RefreshAlertModule,
    RequestsModule
  ],
  providers: [
    AccountsService,
    { provide: TooltipConfig, useFactory: getTooltipConfig },
    AuthService,
    LoginService,
    RegisterService,
    LogoutService,
    DockstoreService,
    DateService,
    TrackLoginService,
    ListService,
    ProviderService,
    ContainerService,
    ImageProviderService,
    CLIENT_ROUTER_PROVIDERS,
    RegisterCheckerWorkflowService,
    RefreshService,
    PagenumberService,
    TwitterService,
    GA4GHService,
    DescriptorLanguageService,
    UrlResolverService,
    MetadataService,
    ExtendedWorkflowsService,
    ExtendedToolsService,
    VerifiedByService,
    Title,
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults},
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: myCustomSnackbarDefaults}
  ],
  entryComponents: [DeleteAccountDialogComponent, YoutubeComponent],
  bootstrap: [AppComponent]
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
