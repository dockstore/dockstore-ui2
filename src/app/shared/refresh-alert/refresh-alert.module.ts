import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StateService } from '../state.service';
import { RefreshAlertComponent } from './refresh-alert.component';
import { NgModule } from '@angular/core';

@NgModule({
    declarations: [
      RefreshAlertComponent
    ],
    imports: [
        CommonModule,
        FormsModule
    ],
    providers: [
      StateService
    ],
    exports: [RefreshAlertComponent]
  })
  export class RefreshAlertModule {}
