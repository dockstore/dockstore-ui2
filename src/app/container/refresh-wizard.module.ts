import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RefreshAlertModule } from 'app/shared/alert/alert.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { RefreshWizardComponent } from './refresh-wizard/refresh-wizard.component';

@NgModule({
  imports: [CommonModule, RefreshAlertModule, CustomMaterialModule],
  declarations: [RefreshWizardComponent],
  exports: [RefreshWizardComponent]
})
export class RefreshWizardModule {}
