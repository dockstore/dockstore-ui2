import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { RefreshAlertModule } from '../shared/alert/alert.module';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { EventsComponent } from './events/events.component';

@NgModule({
  imports: [CommonModule, CustomMaterialModule, FlexLayoutModule, RouterModule, RefreshAlertModule],
  declarations: [EventsComponent],
  exports: [EventsComponent],
})
export class EventsModule {}
