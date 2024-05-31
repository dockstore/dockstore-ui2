import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyProgressBarModule as MatProgressBarModule } from '@angular/material/legacy-progress-bar';
import { CustomMaterialModule } from './../modules/material.module';

import { LoadingComponent } from '../loading/loading.component';
import { AlertComponent } from './alert.component';

@NgModule({
  imports: [MatProgressBarModule, MatIconModule, CommonModule, FormsModule, CustomMaterialModule, AlertComponent, LoadingComponent],
  exports: [AlertComponent, LoadingComponent],
})
export class RefreshAlertModule {}
