import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { UpsertOrganizationMemberModule } from './upsert-organization-member.module';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, CustomMaterialModule, RefreshAlertModule, UpsertOrganizationMemberModule],
  declarations: [OrganizationMembersComponent],
  exports: [OrganizationMembersComponent],
})
export class OrganizationMembersModule {}
