import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
@NgModule({
  imports: [ CommonModule, CustomMaterialModule, FlexLayoutModule ],
  declarations: [ EventsComponent ],
  exports: [ EventsComponent ]
})
export class EventsModule { }
