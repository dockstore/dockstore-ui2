import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HomeComponent } from 'app/home-page/home-logged-out/home.component';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshWizardModule } from '../container/refresh-wizard.module';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CategoryButtonModule } from '../categories/button/category-button.module';
import { JsonLdModule } from '../shared/modules/json-ld.module';
import { RegisterGithubAppModule } from '../shared/modules/register-github-app.module';
import { RecentEventsModule } from './recent-events/recent-events.module';
import { FeaturedContentComponent } from './widget/featured-content/featured-content.component';
import { NewsAndUpdatesComponent } from './widget/featured-content/news-and-updates.component';
import { GettingStartedComponent } from './widget/getting-started/getting-started.component';
import { NewsNotificationsComponent } from './widget/news-updates/news-notifications.component';
import { MySidebarModule } from '../shared/modules/my-sidebar.module';
import { EntryBoxComponent } from './widget/entry-box/entry-box.component';
import { MytoolsService } from 'app/mytools/mytools.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { MyEntriesStore } from 'app/shared/state/my-entries.store';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { RegisterWorkflowModalService } from 'app/workflow/register-workflow-modal/register-workflow-modal.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrganizationBoxComponent } from './widget/organization-box/organization-box.component';
import { StarredBoxComponent } from './widget/starred-box/starred-box.component';
import { HeaderModule } from 'app/shared/modules/header.module';
import { NewsBoxComponent } from './widget/news-box/news-box.component';
import { MarkdownWrapperModule } from '../shared/modules/markdown-wrapper.module';
import { PreviewWarningModule } from '../shared/modules/preview-warning.module';
import { MastodonComponent } from '../shared/mastodon/mastodon.component';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FlexLayoutModule,
    RouterModule,
    FormsModule,
    HttpClientModule,
    RefreshAlertModule,
    MarkdownModule,
    FontAwesomeModule,
    MatAutocompleteModule,
    CategoryButtonModule,
    JsonLdModule,
    MySidebarModule,
    RecentEventsModule,
    RefreshWizardModule,
    HeaderModule,
    MarkdownWrapperModule,
    PreviewWarningModule,
    RegisterGithubAppModule,
  ],
  declarations: [
    HomeComponent,
    FeaturedContentComponent,
    NewsAndUpdatesComponent,
    NewsNotificationsComponent,
    GettingStartedComponent,
    EntryBoxComponent,
    RegisterToolComponent,
    DashboardComponent,
    OrganizationBoxComponent,
    StarredBoxComponent,
    NewsBoxComponent,
    MastodonComponent,
  ],
  providers: [
    MytoolsService,
    MyWorkflowsService,
    MyEntriesStateService,
    MyEntriesStore,
    MyEntriesQuery,
    RegisterToolService,
    RegisterWorkflowModalService,
  ],
})
export class HomePageModule {}
