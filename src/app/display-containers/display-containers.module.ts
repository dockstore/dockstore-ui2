import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HeaderModule } from '../shared/header.module';
import { ContainersModule } from '../shared/containers.module';
import { TabsModule } from '../shared/tabs.module';

import { ContainerService } from './container/container.service';

import { containersRouting } from './display-containers.routing';

import { DisplayContainersComponent } from './display-containers.component';
import { SearchContainersComponent } from './search-containers/search-containers.component';
import { VersionsComponent } from './versions/versions.component';
import { ViewVersionComponent } from './view-version/view-version.component';
import { ContainerComponent } from './container/container.component';

@NgModule({
  declarations: [
    DisplayContainersComponent,
    SearchContainersComponent,
    VersionsComponent,
    ViewVersionComponent,
    ContainerComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule,
    HeaderModule,
    ContainersModule,
    TabsModule,
    containersRouting
  ],
  providers: [
    ContainerService
  ]
})
export class DisplayContainersModule { }
