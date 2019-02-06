import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatProgressBarModule } from '@angular/material';
import { CustomMaterialModule } from './../modules/material.module';

import { AlertComponent } from './alert.component';
import { LoadingComponent } from '../loading/loading.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingComponent
  ],
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
    FormsModule,
    CustomMaterialModule
  ],
  exports: [AlertComponent, LoadingComponent]
})
export class RefreshAlertModule { }
