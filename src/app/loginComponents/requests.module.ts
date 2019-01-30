import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent, OrganizationRequestConfirmDialogComponent,
  OrganizationInviteConfirmDialogComponent } from './requests/requests.component';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { RouterModule } from '@angular/router';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    RouterModule,
    FlexLayoutModule
  ],
  declarations: [
    RequestsComponent,
    OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent
  ], exports: [
    RequestsComponent,
    OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent
  ], entryComponents: [ OrganizationRequestConfirmDialogComponent,
    OrganizationInviteConfirmDialogComponent],
})
export class RequestsModule { }
