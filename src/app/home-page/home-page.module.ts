import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { HomeLoggedInComponent } from 'app/home-page/home-logged-in/home-logged-in.component';
import { HomeComponent } from 'app/home-page/home-logged-out/home.component';
import { LoggedInBannerComponent } from 'app/home-page/logged-in-banner/logged-in-banner.component';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { HomePageComponent } from './home-page.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RouterModule],
  declarations: [HomePageComponent, LoggedInBannerComponent, HomeComponent, HomeLoggedInComponent]
})
export class HomePageModule {}
