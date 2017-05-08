import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';

import { HeaderModule } from './header.module';

import { SelectModule } from './select.module';
import { ListContainersModule } from './list-containers.module';
import { TabsModule } from './tabs.module';
import { ParamfilesModule } from './paramfiles.module';

import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { ContainerService } from '../../container/container.service';
import { LaunchService } from '../../container/launch/launch.service';
import { ViewService } from '../../container/view/view.service';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';

import { ContainerComponent } from '../../container/container.component';
import { LaunchComponent } from '../../container/launch/launch.component';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { FilesContainerComponent } from '../../container/files/files.component';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';

@NgModule({
  declarations: [
    ContainerComponent,
    LaunchComponent,
    VersionsContainerComponent,
    ViewContainerComponent,
    FilesContainerComponent,
    DockerfileComponent,
    DescriptorsComponent,
    ParamfilesComponent
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
    ParamfilesModule
  ],
  providers: [
    HighlightJsService,
    DateService,
    FileService,
    ContainerService,
    LaunchService,
    ViewService,
    DockerfileService,
    ParamfilesService
  ],
  exports: [
    ContainerComponent
  ]
})
export class ContainerModule { }
