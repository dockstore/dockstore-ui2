import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatCardModule, MatExpansionModule, MatProgressBarModule } from '@angular/material';

import { OrganizationMembersComponent } from './organization-members/organization-members.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatProgressBarModule
  ],
  declarations: [OrganizationMembersComponent],
  exports: [OrganizationMembersComponent]
})
export class OrganizationMembersModule { }
