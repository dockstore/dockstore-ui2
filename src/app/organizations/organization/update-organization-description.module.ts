import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTooltipModule, MatTabsModule } from '@angular/material';

import { RefreshAlertModule } from '../../shared/alert/alert.module';
import {
  UpdateOrganizationDescriptionComponent,
} from './update-organization-description/update-organization-description.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxMdModule } from 'ngx-md';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    MatTooltipModule,
    NgxMdModule,
    RefreshAlertModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateOrganizationDescriptionComponent],
  entryComponents: [UpdateOrganizationDescriptionComponent]
})
export class UpdateOrganizationDescriptionModule { }
