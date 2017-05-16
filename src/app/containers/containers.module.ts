import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownModule } from 'angular2-markdown';

import { ContainersComponent } from './containers.component';
import { ContainerModule } from '../shared/modules/container.module';
import { containersRouting } from './containers.routing';
import { HeaderModule } from '../shared/modules/header.module';
import { ListContainersModule } from '../shared/modules/list-containers.module';
import { SearchContainersComponent } from './search/search.component';
import { SelectModule } from '../shared/modules/select.module';

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
