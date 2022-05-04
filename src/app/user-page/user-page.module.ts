import { NgModule } from '@angular/core';
import { UserPageComponent } from './user-page.component';
import { RecentEventsModule } from '../home-page/recent-events/recent-events.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { HeaderModule } from '../shared/modules/header.module';
import { RouterModule } from '@angular/router';
import { UserPageRouting } from './user-page.routing';

@NgModule({
  declarations: [UserPageComponent],
  imports: [RecentEventsModule, FlexLayoutModule, CommonModule, CustomMaterialModule, HeaderModule, RouterModule, UserPageRouting],
  exports: [UserPageComponent],
})
export class UserPageModule {}
