import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests/requests.component';
import { CustomMaterialModule } from './../shared/modules/material.module';

@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule
  ],
  declarations: [
    RequestsComponent
  ]
})
export class RequestsModule { }
