import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SearchComponent } from './search.component';
import { ListentryModule } from '../listentry/listentry.module';
@NgModule({
  imports: [
    CommonModule,
    ListentryModule,
    AccordionModule.forRoot(),
  ],
  // declarations: [
  //   SearchComponent
  // ],
  // exports: [
  //   SearchComponent
  // ]
})
export class SearchModule { }
