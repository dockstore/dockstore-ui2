import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxJsonLdModule } from '@ngx-lite/json-ld';
import { HomeLoggedInComponent } from 'app/home-page/home-logged-in/home-logged-in.component';
import { HomeComponent } from 'app/home-page/home-logged-out/home.component';
import { ListContainersModule } from 'app/shared/modules/list-containers.module';
import { ListWorkflowsModule } from 'app/shared/modules/list-workflows.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshWizardModule } from '../container/refresh-wizard.module';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CategoryButtonModule } from '../categories/button/category-button.module';
import { HomePageComponent } from './home-page.component';
import { RecentEventsModule } from './recent-events/recent-events.module';
import { EntriesComponent } from './widget/entries/entries.component';
import { FeaturedContentComponent } from './widget/featured-content/featured-content.component';
import { FeaturedNewsComponent } from './widget/featured-content/featured-news.component';
import { GettingStartedComponent } from './widget/getting-started/getting-started.component';
import { NewsUpdatesComponent } from './widget/news-updates/news-updates.component';
import { OrganizationsComponent } from './widget/organizations/organizations.component';
import { RequestsComponent } from './widget/requests/requests.component';
import { MySidebarModule } from '../shared/modules/my-sidebar.module';
import { EntryBoxComponent } from './widget/entry-box/entry-box.component';
import { MytoolsService } from 'app/mytools/mytools.service';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { MyServicesService } from 'app/myworkflows/my-services.service';
import { MyBioWorkflowsService } from 'app/myworkflows/my-bio-workflows.service';
import { MyEntriesStateService } from 'app/shared/state/my-entries.service';
import { MyEntriesStore } from 'app/shared/state/my-entries.store';
import { MyEntriesQuery } from 'app/shared/state/my-entries.query';
import { RegisterWorkflowModalService } from 'app/workflow/register-workflow-modal/register-workflow-modal.service';
import { RegisterToolService } from 'app/container/register-tool/register-tool.service';
import { RegisterToolComponent } from 'app/container/register-tool/register-tool.component';
import { NewDashboardComponent } from './new-dashboard/new-dashboard.component';
import { OrganizationBoxComponent } from './widget/organization-box/organization-box.component';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    FlexLayoutModule,
    NgxJsonLdModule,
    RouterModule,
    ListWorkflowsModule,
    ListContainersModule,
    FormsModule,
    HttpClientModule,
    RefreshAlertModule,
    MarkdownModule,
    FontAwesomeModule,
    CategoryButtonModule,
    MySidebarModule,
    RecentEventsModule,
    RefreshWizardModule,
  ],
  declarations: [
    HomePageComponent,
    HomeComponent,
    HomeLoggedInComponent,
    RequestsComponent,
    EntriesComponent,
    OrganizationsComponent,
    FeaturedContentComponent,
    FeaturedNewsComponent,
    NewsUpdatesComponent,
    GettingStartedComponent,
    EntryBoxComponent,
    RegisterToolComponent,
    NewDashboardComponent,
    OrganizationBoxComponent,
  ],
  providers: [
    MytoolsService,
    MyWorkflowsService,
    MyServicesService,
    MyBioWorkflowsService,
    MyEntriesStateService,
    MyEntriesStore,
    MyEntriesQuery,
    RegisterToolService,
    RegisterWorkflowModalService,
  ],
  exports: [NgxJsonLdModule],
})
export class HomePageModule {}
