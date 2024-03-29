import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import { HeaderModule } from '../shared/modules/header.module';
import { ImgFallbackModule } from '../shared/modules/img-fallback.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { OrganizationModule } from './organization.module';
import { UpdateOrganizationDescriptionModule } from './organization/update-organization-description.module';
import { OrganizationsRouting } from './organizations.routing';
import { OrganizationsComponent } from './organizations/organizations.component';
import { RegisterOrganizationModule } from './register-organization.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    CustomMaterialModule,
    OrganizationModule,
    OrganizationsRouting,
    ReactiveFormsModule,
    RegisterOrganizationModule,
    UpdateOrganizationDescriptionModule,
    ImgFallbackModule,
    PipeModule,
  ],
  declarations: [OrganizationsComponent],
})
export class OrganizationsModule {}
