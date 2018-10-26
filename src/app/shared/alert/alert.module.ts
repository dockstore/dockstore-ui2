import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlertComponent } from './alert.component';
import { MatProgressBarModule } from '@angular/material';

@NgModule({
    declarations: [
      AlertComponent
    ],
    imports: [
      MatProgressBarModule,
        CommonModule,
        FormsModule
    ],
    exports: [AlertComponent]
  })
  export class RefreshAlertModule {}
