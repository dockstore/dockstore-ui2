import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { HeaderModule } from './header.module';

import { ListWorkflowsComponent } from '../../workflows/list/list.component';
import { WorkflowObjService } from '../workflow.service';

@NgModule({
  declarations: [
    ListWorkflowsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule.forRoot(),
    HeaderModule
  ],
  exports: [
    ListWorkflowsComponent
  ],
  providers: [
    WorkflowObjService
  ]
})
export class ListWorkflowsModule { }
