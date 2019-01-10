import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule, MatExpansionModule, MatIconModule, MatProgressBarModule, MatButtonModule } from '@angular/material';

import { HeaderModule } from '../shared/modules/header.module';
import { CollectionsModule } from './collections.module';
import { OrganizationComponent } from './organization/organization.component';

@NgModule({
  imports: [
    CollectionsModule,
    CommonModule,
    FlexLayoutModule,
    HeaderModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatIconModule,
    MatProgressBarModule
  ],
  declarations: [ OrganizationComponent ],
  exports: [ OrganizationComponent ]
})
export class OrganizationModule { }
