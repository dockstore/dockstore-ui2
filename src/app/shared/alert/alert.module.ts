import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CustomMaterialModule } from './../modules/material.module';

import { LoadingComponent } from '../loading/loading.component';
import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [AlertComponent, LoadingComponent],
  imports: [MatProgressBarModule, MatIconModule, CommonModule, FormsModule, CustomMaterialModule],
  exports: [AlertComponent, LoadingComponent]
})
export class RefreshAlertModule {}
