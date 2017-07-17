import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ListentryModule } from '../listentry/listentry.module';
@NgModule({
  imports: [
    CommonModule,
    ListentryModule,
    AccordionModule.forRoot()
  ]
})
export class SearchModule { }
