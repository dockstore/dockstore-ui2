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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarConfig, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatTooltipDefaultOptions, MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/tooltip';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService, Ng2UiAuthModule } from 'ng2-ui-auth';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AppComponent } from './app.component';
import { CLIENT_ROUTER_PROVIDERS, routing } from './app.routing';
import { BannerComponent } from './banner/banner.component';
import { ConfigurationService } from './configuration.service';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { FooterComponent } from './footer/footer.component';
import { GitTagPipe } from './footer/git-tag.pipe';
import { FundingComponent } from './funding/funding.component';
import { GithubCallbackComponent } from './github-callback/github-callback.component';
import { YoutubeComponent } from './home-page/home-logged-out/home.component';
import { HomePageModule } from './home-page/home-page.module';
import { CustomHeaderInterceptor } from './interceptors/custom-header.interceptor';
import { WorkflowVersionsInterceptor } from './interceptors/workflow-versions.interceptor';
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';
import { AccountsComponent } from './loginComponents/accounts/accounts.component';
import { ControlsComponent } from './loginComponents/accounts/controls/controls.component';
import { DeleteAccountDialogComponent } from './loginComponents/accounts/controls/delete-account-dialog/delete-account-dialog.component';
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
import { RequestsModule } from './loginComponents/requests.module';
import { LogoutComponent } from './logout/logout.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { MetadataService } from './metadata/metadata.service';
import { NavbarComponent } from './navbar/navbar.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { OrganizationStargazersModule } from './organizations/organization/organization-stargazers/organization-stargazers.module';
import { OrganizationStarringModule } from './organizations/organization/organization-starring/organization-starring.module';
import { RegisterService } from './register/register.service';
import { SessionExpiredComponent } from './session-expired/session-expired.component';
import { RefreshAlertModule } from './shared/alert/alert.module';
import { AuthConfig } from './shared/auth.model';
import { ContainerService } from './shared/container.service';
import { DateService } from './shared/date.service';
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
import { SnackbarModule } from './shared/modules/snackbar.module';
import { ApiModule as ApiModule2 } from './shared/openapi/api.module';
import { GA4GHV20Service } from './shared/openapi/api/gA4GHV20.service';
import { PagenumberService } from './shared/pagenumber.service';
import { ProviderService } from './shared/provider.service';
import { RefreshService } from './shared/refresh.service';
import { ApiModule } from './shared/swagger/api.module';
import { GA4GHService } from './shared/swagger/api/gA4GH.service';
import { Configuration } from './shared/swagger/configuration';
import { TrackLoginService } from './shared/track-login.service';
import { TwitterService } from './shared/twitter.service';
import { UrlResolverService } from './shared/url-resolver.service';
import { VerifiedByService } from './shared/verified-by.service';
import { SitemapComponent } from './sitemap/sitemap.component';
import { StargazersModule } from './stargazers/stargazers.module';
import { StarredEntriesComponent } from './starredentries/starredentries.component';
import { StarringModule } from './starring/starring.module';
import { TosBannerService } from './tosBanner/state/tos-banner.service';
import { TosBannerComponent } from './tosBanner/tos-banner.component';
import { ViewService } from './workflow/view/view.service';

export const myCustomTooltipDefaults: MatTooltipDefaultOptions = {
  showDelay: 500,
  hideDelay: 500,
  touchendHideDelay: 500,
};

export const myCustomSnackbarDefaults: MatSnackBarConfig = {
  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
};

export function configurationServiceFactory(configurationService: ConfigurationService): Function {
  return () => configurationService.load();
}

@NgModule({
  declarations: [
    AppComponent,
    ControlsComponent,
    DeleteAccountDialogComponent,
    NavbarComponent,
    FooterComponent,
    NotificationsComponent,
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
    SitemapComponent,
    GithubCallbackComponent,
    ConfirmationDialogComponent,
    SessionExpiredComponent,
    TosBannerComponent,
    LogoutComponent,
    GitTagPipe,
    AboutComponent,
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
    ClipboardModule,
    OrderByModule,
    FlexLayoutModule,
    StarringModule,
    OrganizationStarringModule,
    OrganizationStargazersModule,
    routing,
    StargazersModule,
    MarkdownModule.forRoot(),
    ReactiveFormsModule,
    ApiModule.forRoot(getApiConfig),
    ApiModule2.forRoot(getApiConfig),
    CustomMaterialModule,
    RefreshAlertModule,
    RequestsModule,
    HomePageModule,
    HttpClientModule,
    SnackbarModule,
  ],
  providers: [
    AccountsService,
    AuthService,
    LoginService,
    RegisterService,
    LogoutService,
    DateService,
    TrackLoginService,
    ListService,
    ProviderService,
    ContainerService,
    ImageProviderService,
    HttpClient,
    CLIENT_ROUTER_PROVIDERS,
    RegisterCheckerWorkflowService,
    RefreshService,
    PagenumberService,
    TwitterService,
    GA4GHService,
    GA4GHV20Service,
    DescriptorLanguageService,
    UrlResolverService,
    MetadataService,
    ExtendedWorkflowsService,
    ExtendedToolsService,
    VerifiedByService,
    Title,
    ViewService,
    TosBannerService,
    ConfigurationService,
    {
      provide: APP_INITIALIZER,
      useFactory: configurationServiceFactory,
      deps: [ConfigurationService],
      multi: true,
    },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: myCustomSnackbarDefaults },
    { provide: HTTP_INTERCEPTORS, useClass: WorkflowVersionsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CustomHeaderInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export const apiConfig = new Configuration({
  apiKeys: {},
  basePath: window.location.protocol + '//' + window.location.host + '/api',
});

export function getApiConfig() {
  return apiConfig;
}
