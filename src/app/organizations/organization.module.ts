import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatIconModule, MatProgressBarModule } from '@angular/material';

import { HeaderModule } from '../shared/modules/header.module';
import { CollectionsModule } from './collections.module';
import { OrganizationMembersModule } from './organization-members.module';
import { OrganizationComponent } from './organization/organization.component';
import { EventsModule } from './events.module';

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
    MatProgressBarModule,
    OrganizationMembersModule,
    EventsModule
  ],
  declarations: [ OrganizationComponent ],
  exports: [ OrganizationComponent ]
})
export class OrganizationModule { }
