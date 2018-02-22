import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../state.service';
import { AlertComponent } from './alert.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      AlertComponent
],
    imports: [
        CommonModule,
        FormsModule
    ],
    providers: [
      StateService
    ],
    exports: [AlertComponent]
  })
  export class RefreshAlertModule {}
