import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { HeaderModule } from '../shared/header.module';
import { SelectModule } from '../shared/select.module';
import { ListContainersModule } from '../shared/list-containers.module';
import { TabsModule } from '../shared/tabs.module';
import { DescriptorsModule } from '../shared/descriptors.module';
import { ParamfilesModule } from '../shared/paramfiles.module';

import { ContainerService } from './container/container.service';

import { containersRouting } from './containers.routing';

import { ContainersComponent } from './containers.component';
import { SearchContainersComponent } from './search/search.component';
import { VersionsContainerComponent } from './versions/versions.component';
import { ViewContainerComponent } from './view/view.component';
import { ContainerComponent } from './container/container.component';
import { FilesContainerComponent } from './files/files.component';
import { DockerfileComponent } from './dockerfile/dockerfile.component';

@NgModule({
  declarations: [
    ContainersComponent,
    SearchContainersComponent,
    VersionsContainerComponent,
    ViewContainerComponent,
    ContainerComponent,
    FilesContainerComponent,
    DockerfileComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    TabsModule,
    DescriptorsModule,
    ParamfilesModule,
    containersRouting
  ],
  providers: [
    HighlightJsService,
    ContainerService
  ]
})
export class ContainersModule { }
