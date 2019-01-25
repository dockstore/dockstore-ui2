import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatProgressBarModule } from '@angular/material';

import { OrganizationMembersComponent } from './organization-members/organization-members.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RefreshAlertModule } from '../shared/alert/alert.module';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule,
    RefreshAlertModule
  ],
  declarations: [OrganizationMembersComponent],
  exports: [OrganizationMembersComponent]
})
export class OrganizationMembersModule { }
