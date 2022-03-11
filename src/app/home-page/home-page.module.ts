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
import { EntryToDisplayNamePipe } from 'app/shared/entry-to-display-name.pipe';
import { ListContainersModule } from 'app/shared/modules/list-containers.module';
import { ListWorkflowsModule } from 'app/shared/modules/list-workflows.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { MarkdownModule } from 'ngx-markdown';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CategoryButtonModule } from '../categories/button/category-button.module';
import { HomePageComponent } from './home-page.component';
import { RecentEventsComponent } from './recent-events/recent-events.component';
import { EntriesComponent } from './widget/entries/entries.component';
import { FeaturedContentComponent } from './widget/featured-content/featured-content.component';
import { FeaturedNewsComponent } from './widget/featured-content/featured-news.component';
import { GettingStartedComponent } from './widget/getting-started/getting-started.component';
import { NewsUpdatesComponent } from './widget/news-updates/news-updates.component';
import { OrganizationsComponent } from './widget/organizations/organizations.component';
import { RequestsComponent } from './widget/requests/requests.component';
import { MySidebarModule } from '../shared/modules/my-sidebar.module';

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
  ],
  declarations: [
    HomePageComponent,
    HomeComponent,
    HomeLoggedInComponent,
    RecentEventsComponent,
    RequestsComponent,
    EntriesComponent,
    OrganizationsComponent,
    FeaturedContentComponent,
    FeaturedNewsComponent,
    NewsUpdatesComponent,
    GettingStartedComponent,
    EntryToDisplayNamePipe,
  ],
  exports: [NgxJsonLdModule],
})
export class HomePageModule {}
