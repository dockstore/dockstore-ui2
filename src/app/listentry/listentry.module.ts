import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListentryComponent } from './listentry.component';
import { DataTablesModule } from 'angular-datatables';
import { RouterModule } from '@angular/router';
import { ClipboardModule } from 'ngx-clipboard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule.forRoot(),
    ClipboardModule
  ],
  declarations: [ListentryComponent],
  exports: [ListentryComponent]
})
export class ListentryModule { }
