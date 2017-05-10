import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { HeaderModule } from '../shared/modules/header.module';
import { SelectModule } from '../shared/modules/select.module';
import { ListContainersModule } from '../shared/modules/list-containers.module';
import { TabModule } from '../shared/modules/tabs.module';

import { ContainerService } from '../container/container.service';

import { containersRouting } from './containers.routing';

import { ContainersComponent } from './containers.component';
import { SearchContainersComponent } from './search/search.component';
import { ContainerModule } from '../shared/modules/container.module';

@NgModule({
  declarations: [
    ContainersComponent,
    SearchContainersComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    ContainerModule,
    containersRouting
  ],
  providers: [
    HighlightJsService
  ]
})
export class ContainersModule { }
