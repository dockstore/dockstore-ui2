import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventsComponent } from './events/events.component';
import { CustomMaterialModule } from './../shared/modules/material.module';
@NgModule({
  imports: [ CommonModule, CustomMaterialModule ],
  declarations: [ EventsComponent ],
  exports: [ EventsComponent ]
})
export class EventsModule { }
