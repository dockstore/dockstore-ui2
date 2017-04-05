import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataTablesModule } from 'angular-datatables';
import { ClipboardModule } from 'ngx-clipboard';
import { HeaderModule } from '../shared/header.module';

import { ContainersService } from '../display-containers/containers/containers.service';

import { ContainersComponent } from '../display-containers/containers/containers.component';

@NgModule({
  declarations: [
    ContainersComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    DataTablesModule,
    ClipboardModule,
    HeaderModule
  ],
  providers: [
    ContainersService
  ],
  exports: [
    ContainersComponent
  ]
})
export class ContainersModule { }
