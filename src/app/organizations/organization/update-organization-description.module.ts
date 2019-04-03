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
import { OrganizationStarringComponent } from './organization-starring/organization-starring.component';
import {OrganizationStarringService} from './organization-starring/organization-starring.service';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    CustomMaterialModule,
    NgxMdModule,
    RefreshAlertModule,
    ReactiveFormsModule
  ],
  providers: [ OrganizationStarringService],
  exports: [OrganizationStarringComponent],
  declarations: [UpdateOrganizationOrCollectionDescriptionComponent, OrganizationStarringComponent],
  entryComponents: [UpdateOrganizationOrCollectionDescriptionComponent]
})
export class UpdateOrganizationDescriptionModule { }
