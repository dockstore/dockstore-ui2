import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { HeaderModule } from '../shared/header.module';

import { ListWorkflowsService } from '../workflows/list/list.service';

import { ListWorkflowsComponent } from '../workflows/list/list.component';

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
  providers: [
    ListWorkflowsService
  ],
  exports: [
    ListWorkflowsComponent
  ]
})
export class ListWorkflowsModule { }
