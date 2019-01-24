import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestsComponent } from './requests/requests.component';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { RouterModule } from '@angular/router';
@NgModule({
  imports: [
    CommonModule,
    CustomMaterialModule,
    RouterModule
  ],
  declarations: [
    RequestsComponent
  ]
})
export class RequestsModule { }
