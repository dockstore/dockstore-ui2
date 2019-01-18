import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatProgressBarModule } from '@angular/material';
import { CustomMaterialModule } from './../modules/material.module';

import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    CustomMaterialModule
  ],
  exports: [AlertComponent]
})
export class RefreshAlertModule { }
