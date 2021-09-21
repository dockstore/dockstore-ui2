import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { AlertService } from '../shared/alert/state/alert.service';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { RegisterOrganizationComponent } from './registerOrganization/register-organization.component';
import { RouterModule } from '@angular/router';
import { RequireAccountsModalComponent } from './registerOrganization/requireAccountsModal/require-accounts-modal.component';
import { FlexModule } from '@angular/flex-layout';

@NgModule({
  imports: [CommonModule, FormsModule, CustomMaterialModule, ReactiveFormsModule, RefreshAlertModule, RouterModule, FlexModule],
  declarations: [RegisterOrganizationComponent, RequireAccountsModalComponent],
  providers: [AlertService],
})
export class RegisterOrganizationModule {}
