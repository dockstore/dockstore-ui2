import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomMaterialModule } from './../shared/modules/material.module';
import {
  OrganizationDeleteConfirmDialogComponent,
  OrganizationInviteConfirmDialogComponent,
  OrganizationRequestConfirmDialogComponent,
  RequestsComponent
} from './requests/requests.component';
@NgModule({
  imports: [CommonModule, CustomMaterialModule, RouterModule, FlexLayoutModule],
  declarations: [
    RequestsComponent,
    OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent,
    OrganizationDeleteConfirmDialogComponent
  ],
  exports: [
    RequestsComponent,
    OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent,
    OrganizationDeleteConfirmDialogComponent
  ],
  entryComponents: [
    OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent,
    OrganizationDeleteConfirmDialogComponent
  ]
})
export class RequestsModule {}
