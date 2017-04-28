import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ClipboardModule } from 'ngx-clipboard';
import { HeaderModule } from './header.module';

import { ListContainersService } from '../../containers/list/list.service';

import { ListContainersComponent } from '../../containers/list/list.component';

@NgModule({
  declarations: [
    ListContainersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    ClipboardModule,
    HeaderModule
  ],
  providers: [
    ListContainersService
  ],
  exports: [
    ListContainersComponent
  ]
})
export class ListContainersModule { }
