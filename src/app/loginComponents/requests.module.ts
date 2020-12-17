import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { CustomMaterialModule } from './../shared/modules/material.module';
import {
  OrganizationInviteConfirmDialogComponent,
  OrganizationRequestConfirmDialogComponent,
  RequestsComponent,
} from './requests/requests.component';
@NgModule({
  imports: [CommonModule, CustomMaterialModule, RouterModule, FlexLayoutModule],
  declarations: [RequestsComponent, OrganizationRequestConfirmDialogComponent, OrganizationInviteConfirmDialogComponent],
  exports: [RequestsComponent, OrganizationRequestConfirmDialogComponent, OrganizationInviteConfirmDialogComponent],
  entryComponents: [OrganizationRequestConfirmDialogComponent, OrganizationInviteConfirmDialogComponent],
})
export class RequestsModule {}
