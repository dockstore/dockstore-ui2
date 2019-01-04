import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule, MatProgressBarModule } from '@angular/material';

import { AlertComponent } from './alert.component';

@NgModule({
  declarations: [
    AlertComponent
  ],
  imports: [
    MatProgressBarModule,
    MatIconModule,
    CommonModule,
    FormsModule
  ],
  exports: [AlertComponent]
})
export class RefreshAlertModule { }
