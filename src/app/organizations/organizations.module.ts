import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

import { HeaderModule } from '../shared/modules/header.module';
import { OrganizationModule } from './organization.module';
import { OrganizationsRouting } from './organizations.routing';
import { OrganizationsComponent } from './organizations/organizations.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    OrganizationModule,
    OrganizationsRouting
  ],
  declarations: [OrganizationsComponent]
})
export class OrganizationsModule { }
