import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { UpsertOrganizationMemberComponent } from './upsert-organization-member/upsert-organization-member.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, CustomMaterialModule, ReactiveFormsModule, RefreshAlertModule],
  declarations: [UpsertOrganizationMemberComponent],
  entryComponents: [UpsertOrganizationMemberComponent]
})
export class UpsertOrganizationMemberModule {}
