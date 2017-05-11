import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownModule } from 'angular2-markdown';
import { ContainerModule } from '../shared/modules/container.module';

import { HeaderModule } from '../shared/modules/header.module';
import { ListContainersModule } from '../shared/modules/list-containers.module';
import { SelectModule } from '../shared/modules/select.module';

import { ContainersComponent } from './containers.component';

import { containersRouting } from './containers.routing';
import { SearchContainersComponent } from './search/search.component';

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
export class ContainersModule {
}
