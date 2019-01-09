import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule } from '@angular/material';

import { HeaderModule } from '../shared/modules/header.module';
import { OrganizationModule } from './organization.module';
import { OrganizationsRouting } from './organizations.routing';
import { OrganizationsComponent } from './organizations/organizations.component';
import { RegisterOrganizationModule } from './register-organization.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    OrganizationModule,
    OrganizationsRouting,
    ReactiveFormsModule,
    RegisterOrganizationModule
  ],
  declarations: [OrganizationsComponent]
})
export class OrganizationsModule { }
