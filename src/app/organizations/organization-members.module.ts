import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatTooltipModule,
} from '@angular/material';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { UpsertOrganizationMemberModule } from './upsert-organization-member.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    MatTooltipModule,
    RefreshAlertModule,
    UpsertOrganizationMemberModule,
  ],
  declarations: [OrganizationMembersComponent],
  exports: [OrganizationMembersComponent]
})
export class OrganizationMembersModule { }
