import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';

import { ListContainersComponent } from '../../containers/list/list.component';

import { ListContainersService } from '../../containers/list/list.service';
import { HeaderModule } from './header.module';
import { ToolObservableService } from '../tool-observable.service';

@NgModule({
  declarations: [
    ListContainersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule.forRoot(),
    ClipboardModule,
    HeaderModule,
    TooltipModule.forRoot(),
  ],
  providers: [
    ListContainersService,
    ToolObservableService
  ],
  exports: [
    ListContainersComponent
  ]
})
export class ListContainersModule {
}
