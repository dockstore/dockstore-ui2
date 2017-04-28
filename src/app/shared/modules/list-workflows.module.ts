import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { HeaderModule } from './header.module';

import { ListWorkflowsComponent } from '../../workflows/list/list.component';

@NgModule({
  declarations: [
    ListWorkflowsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    HeaderModule
  ],
  exports: [
    ListWorkflowsComponent
  ]
})
export class ListWorkflowsModule { }
