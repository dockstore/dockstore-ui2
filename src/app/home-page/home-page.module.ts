import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HomeLoggedInComponent } from 'app/home-page/home-logged-in/home-logged-in.component';
import { HomeComponent } from 'app/home-page/home-logged-out/home.component';
import { LoggedInBannerComponent } from 'app/home-page/logged-in-banner/logged-in-banner.component';
import { ListContainersModule } from 'app/shared/modules/list-containers.module';
import { ListWorkflowsModule } from 'app/shared/modules/list-workflows.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { TabsModule } from 'ngx-bootstrap';
import { HomePageComponent } from './home-page.component';
import { OldHomePageComponent, YoutubeComponent } from './old-home-page/old-home-page.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RouterModule, ListWorkflowsModule, ListContainersModule, TabsModule],
  declarations: [HomePageComponent, LoggedInBannerComponent, HomeComponent, HomeLoggedInComponent, OldHomePageComponent, YoutubeComponent],
  entryComponents: [YoutubeComponent]
})
export class HomePageModule {}
