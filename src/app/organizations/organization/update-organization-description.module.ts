import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMdModule } from 'ngx-md';

import { RefreshAlertModule } from '../../shared/alert/alert.module';
import { CustomMaterialModule } from '../../shared/modules/material.module';
import {
  UpdateOrganizationOrCollectionDescriptionComponent,
} from './update-organization-description/update-organization-description.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    CustomMaterialModule,
    NgxMdModule,
    RefreshAlertModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateOrganizationOrCollectionDescriptionComponent],
  entryComponents: [UpdateOrganizationOrCollectionDescriptionComponent]
})
export class UpdateOrganizationDescriptionModule { }
