import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatTooltipModule } from '@angular/material';

import { RefreshAlertModule } from '../../shared/alert/alert.module';
import {
  UpdateOrganizationDescriptionComponent,
} from './update-organization-description/update-organization-description.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    RefreshAlertModule,
    ReactiveFormsModule
  ],
  declarations: [UpdateOrganizationDescriptionComponent],
  entryComponents: [UpdateOrganizationDescriptionComponent]
})
export class UpdateOrganizationDescriptionModule { }
