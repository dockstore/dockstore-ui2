import { NgModule } from '@angular/core';
import { UserPageComponent } from './user-page.component';
import { RecentEventsModule } from '../home-page/recent-events/recent-events.module';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { CommonModule } from '@angular/common';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { HeaderModule } from '../shared/modules/header.module';
import { RouterModule } from '@angular/router';
import { UserPageRouting } from './user-page.routing';

@NgModule({
  imports: [
    RecentEventsModule,
    FlexLayoutModule,
    CommonModule,
    CustomMaterialModule,
    HeaderModule,
    RouterModule,
    UserPageRouting,
    UserPageComponent,
  ],
  exports: [UserPageComponent],
})
export class UserPageModule {}
