import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RefreshAlertModule } from 'app/shared/alert/alert.module';
import { CustomMaterialModule } from 'app/shared/modules/material.module';
import { RefreshWizardComponent } from './refresh-wizard/refresh-wizard.component';
import { RefreshWizardQuery } from './state/refresh-wizard.query';
import { RefreshWizardService } from './state/refresh-wizard.service';
import { RefreshWizardStore } from './state/refresh-wizard.store';

@NgModule({
  imports: [CommonModule, RefreshAlertModule, CustomMaterialModule],
  declarations: [RefreshWizardComponent],
  providers: [RefreshWizardQuery, RefreshWizardStore, RefreshWizardService],
  exports: [RefreshWizardComponent]
})
export class RefreshWizardModule {}
