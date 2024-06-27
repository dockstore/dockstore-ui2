import { ClipboardModule } from '@angular/cdk/clipboard';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_INITIALIZER, enableProdMode, importProvidersFrom } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyDialogModule } from '@angular/material/legacy-dialog';
import {
  MAT_LEGACY_SNACK_BAR_DEFAULT_OPTIONS as MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatLegacySnackBarModule,
} from '@angular/material/legacy-snack-bar';
import { MAT_LEGACY_TOOLTIP_DEFAULT_OPTIONS as MAT_TOOLTIP_DEFAULT_OPTIONS } from '@angular/material/legacy-tooltip';
import { bootstrapApplication, BrowserModule, Title } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { enableAkitaProdMode } from '@datorama/akita';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MarkdownModule } from 'ngx-markdown';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AppComponent } from './app/app.component';

import { getApiConfig, initializerFactory, myCustomSnackbarDefaults, myCustomTooltipDefaults } from './app/app.module';
import { CLIENT_ROUTER_PROVIDERS, routing } from './app/app.routing';
import { ConfigurationService } from './app/configuration.service';
import { EmailService } from './app/container/email.service';
import { InfoTabService as ContainerInfoTabService } from './app/container/info-tab/info-tab.service';
import { ToolLaunchService } from './app/container/launch/tool-launch.service';
import { ParamfilesService } from './app/container/paramfiles/paramfiles.service';
import { RegisterToolService } from './app/container/register-tool/register-tool.service';
import { VersionModalService as ContainerVersionModalService } from './app/container/version-modal/version-modal.service';
import { ListContainersService } from './app/containers/list/list.service';
import { EntryTypeMetadataService } from './app/entry/type-metadata/entry-type-metadata.service';
import { CustomHeaderInterceptor } from './app/interceptors/custom-header.interceptor';
import { WorkflowVersionsInterceptor } from './app/interceptors/workflow-versions.interceptor';
import { LoginService } from './app/login/login.service';
import { AccountsService } from './app/loginComponents/accounts/external/accounts.service';
import { MytoolsService } from './app/mytools/mytools.service';
import { MyWorkflowsService } from './app/myworkflows/myworkflows.service';
import { CONFIG_OPTIONS, ConfigService } from './app/ng2-ui-auth/lib/config.service';
import { Ng2UiAuthModule } from './app/ng2-ui-auth/public_api';
import { OrganizationStargazersModule } from './app/organizations/organization/organization-stargazers/organization-stargazers.module';
import { OrganizationStarringModule } from './app/organizations/organization/organization-starring/organization-starring.module';
import { RegisterService } from './app/register/register.service';
import { SearchAuthorsHtmlPipe } from './app/search/search-authors-html.pipe';
import { SearchService } from './app/search/state/search.service';
import { ServiceInfoService } from './app/service-info/service-info.service';
import { AuthConfig } from './app/shared/auth.model';
import { BioschemaService } from './app/shared/bioschema.service';
import { ContainerService } from './app/shared/container.service';
import { DateService } from './app/shared/date.service';
import { EntryActionsService } from './app/shared/entry-actions/entry-actions.service';
import { DescriptorLanguageService } from './app/shared/entry/descriptor-language.service';
import { RegisterCheckerWorkflowService } from './app/shared/entry/register-checker-workflow/register-checker-workflow.service';
import { ExtendedToolsService } from './app/shared/extended-tools.service';
import { ExtendedWorkflowsService } from './app/shared/extended-workflows.service';
import { ImageProviderService } from './app/shared/image-provider.service';
import { ListService } from './app/shared/list.service';
import { LogoutService } from './app/shared/logout.service';
import { ApiModule, ApiModule as ApiModule2 } from './app/shared/openapi/api.module';
import { GA4GHV20Service } from './app/shared/openapi/api/gA4GHV20.service';
import { OrgLogoService } from './app/shared/org-logo.service';
import { PagenumberService } from './app/shared/pagenumber.service';
import { PipeModule } from './app/shared/pipe/pipe.module';
import { ProviderService } from './app/shared/provider.service';
import { RefreshService } from './app/shared/refresh.service';
import { MyEntriesQuery } from './app/shared/state/my-entries.query';
import { MyEntriesStateService } from './app/shared/state/my-entries.service';
import { MyEntriesStore } from './app/shared/state/my-entries.store';
import { TrackLoginService } from './app/shared/track-login.service';
import { UrlResolverService } from './app/shared/url-resolver.service';
import { VerifiedByService } from './app/shared/verified-by.service';
import { StargazersModule } from './app/stargazers/stargazers.module';
import { StarringModule } from './app/starring/starring.module';
import { TosBannerService } from './app/tosBanner/state/tos-banner.service';
import { InfoTabService } from './app/workflow/info-tab/info-tab.service';
import { WorkflowLaunchService } from './app/workflow/launch/workflow-launch.service';
import { RegisterWorkflowModalService } from './app/workflow/register-workflow-modal/register-workflow-modal.service';
import { VersionModalService } from './app/workflow/version-modal/version-modal.service';
import { ViewService } from './app/workflow/view/view.service';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  enableAkitaProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      environment.production ? [] : AkitaNgDevtools.forRoot(),
      FontAwesomeModule,
      BrowserModule,
      FormsModule,
      MatLegacyDialogModule,
      MatLegacySnackBarModule,
      ClipboardModule,
      FlexLayoutModule,
      StarringModule,
      OrganizationStarringModule,
      OrganizationStargazersModule,
      NgxMatSelectSearchModule,
      routing,
      StargazersModule,
      MarkdownModule.forRoot(),
      ReactiveFormsModule,
      ApiModule.forRoot(getApiConfig),
      ApiModule2.forRoot(getApiConfig),
      PipeModule,
      Ng2UiAuthModule.forRoot(AuthConfig)
    ),
    AccountsService,
    BioschemaService,
    CLIENT_ROUTER_PROVIDERS,
    ConfigurationService,
    ContainerInfoTabService,
    ContainerService,
    ContainerVersionModalService,
    DateService,
    DescriptorLanguageService,
    EmailService,
    EntryActionsService,
    EntryTypeMetadataService,
    ExtendedToolsService,
    ExtendedWorkflowsService,
    GA4GHV20Service,
    HttpClient,
    ImageProviderService,
    InfoTabService,
    InfoTabService,
    ListContainersService,
    ListService,
    LoginService,
    LogoutService,
    MyEntriesQuery,
    MyEntriesStateService,
    MyEntriesStore,
    MyWorkflowsService,
    MytoolsService,
    OrgLogoService,
    PagenumberService,
    ParamfilesService,
    ProviderService,
    RefreshService,
    RegisterCheckerWorkflowService,
    RegisterService,
    RegisterToolService,
    RegisterWorkflowModalService,
    SearchAuthorsHtmlPipe,
    SearchService,
    ServiceInfoService,
    Title,
    ToolLaunchService,
    TosBannerService,
    TrackLoginService,
    UrlResolverService,
    VerifiedByService,
    VersionModalService,
    ViewService,
    WorkflowLaunchService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializerFactory,
      deps: [ConfigurationService, EntryTypeMetadataService],
      multi: true,
    },
    { provide: MAT_TOOLTIP_DEFAULT_OPTIONS, useValue: myCustomTooltipDefaults },
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: myCustomSnackbarDefaults },
    { provide: HTTP_INTERCEPTORS, useClass: WorkflowVersionsInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: CustomHeaderInterceptor, multi: true },
    { provide: Window, useValue: window },
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
  ],
});
