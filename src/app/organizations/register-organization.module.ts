import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { AlertService } from '../shared/alert/state/alert.service';
import { RegisterOrganizationComponent } from './registerOrganization/register-organization.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RefreshAlertModule
  ],
  declarations: [RegisterOrganizationComponent],
  providers: [AlertService],
  entryComponents: [RegisterOrganizationComponent]
})
export class RegisterOrganizationModule { }
