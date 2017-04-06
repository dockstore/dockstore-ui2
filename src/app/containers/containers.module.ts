import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HeaderModule } from '../shared/header.module';
import { SelectModule } from '../shared/select.module';
import { ListContainersModule } from '../shared/list-containers.module';
import { TabsModule } from '../shared/tabs.module';

import { ContainerService } from './container/container.service';

import { containersRouting } from './containers.routing';

import { ContainersComponent } from './containers.component';
import { SearchContainersComponent } from './search/search.component';
import { VersionsContainerComponent } from './versions/versions.component';
import { ViewContainerComponent } from './view/view.component';
import { ContainerComponent } from './container/container.component';

@NgModule({
  declarations: [
    ContainersComponent,
    SearchContainersComponent,
    VersionsContainerComponent,
    ViewContainerComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    TabsModule,
    containersRouting
  ],
  providers: [
    ContainerService
  ]
})
export class ContainersModule { }
