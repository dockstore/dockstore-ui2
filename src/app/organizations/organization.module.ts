import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';


import { HeaderModule } from '../shared/modules/header.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { CollectionsModule } from './collections.module';
import { OrganizationMembersModule } from './organization-members.module';
import { OrganizationComponent } from './organization/organization.component';
import { UpdateOrganizationDescriptionModule } from './organization/update-organization-description.module';
import { EventsModule } from './events.module';
import { RouterModule } from '@angular/router';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { OrganizationMemberRemoveConfirmDialogComponent } from './organization-members/organization-members.component';
import { OrganizationStarringModule} from './organization/organization-starring/organization-starring.module';
import {OrganizationStargazersModule} from './organization/organization-stargazers/organization-stargazers.module';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  imports: [
    CollectionsModule,
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    CustomMaterialModule,
    OrganizationMembersModule,
    UpdateOrganizationDescriptionModule,
    EventsModule,
    RouterModule,
    RefreshAlertModule,
    OrganizationStarringModule,
    OrganizationStargazersModule,
    MarkdownModule
  ],
  declarations: [ OrganizationComponent, OrganizationMemberRemoveConfirmDialogComponent ],
  exports: [ OrganizationComponent, OrganizationMemberRemoveConfirmDialogComponent ],
  entryComponents: [ OrganizationMemberRemoveConfirmDialogComponent ]
})
export class OrganizationModule { }
