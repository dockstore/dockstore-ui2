import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownModule } from 'angular2-markdown';
/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';

import { ContainerComponent } from '../../container/container.component';
import { ContainerService } from '../../container/container.service';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { FilesContainerComponent } from '../../container/files/files.component';
import { LaunchComponent } from '../../container/launch/launch.component';
import { LaunchService } from '../../container/launch/launch.service';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { ViewService } from '../../container/view/view.service';

import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { HeaderModule } from './header.module';
import { ListContainersModule } from './list-containers.module';
import { ParamfilesModule } from './paramfiles.module';
import { SelectModule } from './select.module';

@NgModule({
  declarations: [
    ContainerComponent,
    LaunchComponent,
    VersionsContainerComponent,
    ViewContainerComponent,
    FilesContainerComponent,
    DockerfileComponent,
    DescriptorsComponent,
    ParamfilesComponent,
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    ParamfilesModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot()
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
export class ContainerModule {
}
