import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMdModule } from 'ngx-md';

import { HeaderModule } from '../shared/modules/header.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { CollectionsModule } from './collections.module';
import { OrganizationMembersModule } from './organization-members.module';
import { OrganizationComponent } from './organization/organization.component';
import { UpdateOrganizationDescriptionModule } from './organization/update-organization-description.module';
import { EventsModule } from './events.module';
import { RouterModule } from '@angular/router';
import { RefreshAlertModule } from '../shared/alert/alert.module';

@NgModule({
  imports: [
    CollectionsModule,
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    CustomMaterialModule,
    NgxMdModule,
    OrganizationMembersModule,
    UpdateOrganizationDescriptionModule,
    EventsModule,
    RouterModule,
    RefreshAlertModule
  ],
  declarations: [ OrganizationComponent ],
  exports: [ OrganizationComponent ]
})
export class OrganizationModule { }
