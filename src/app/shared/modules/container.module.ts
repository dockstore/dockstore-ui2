import { ErrorService } from './../../container/error.service';
import { InfoTabService } from './../../container/info-tab/info-tab.service';
import { InfoTabComponent } from './../../container/info-tab/info-tab.component';
import { VersionModalService } from './../../container/version-modal/version-modal.service';
import { VersionModalComponent } from './../../container/version-modal/version-modal.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ClipboardModule } from 'ngx-clipboard';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from '../angular2-highlight-js/lib/highlight-js.module';
import { MarkdownModule } from 'angular2-markdown';
import { StarringModule } from '../../starring/starring.module';

/* External Library */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ShareButtonsModule } from 'ngx-sharebuttons';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AddTagComponent } from './../../container/add-tag/add-tag.component';
import { ContainerComponent } from '../../container/container.component';
import { ContainerService } from '../container.service';
import { DateService } from '../date.service';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { FilesContainerComponent } from '../../container/files/files.component';
import { FileService } from '../file.service';
import { HeaderModule } from './header.module';
import { LaunchComponent } from '../../container/launch/launch.component';
import { ToolLaunchService } from '../../container/launch/tool-launch.service';
import { ListContainersModule } from './list-containers.module';
import { ModalComponent } from './../../container/deregister-modal/deregister-modal.component';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';
import { ParamfilesModule } from './paramfiles.module';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { RefreshService } from './../refresh.service';
import { RegisterToolService } from './../../container/register-tool/register-tool.service';
import { SelectModule } from './select.module';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { WorkflowService } from '../workflow.service';
import { StarringService } from '../../starring/starring.service';

import { StargazersModule } from '../../stargazers/stargazers.module';
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
    ModalComponent,
    AddTagComponent,
    VersionModalComponent,
    InfoTabComponent
  ],
  imports: [
    ButtonsModule.forRoot(),
    CommonModule,
    ClipboardModule,
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
    AlertModule.forRoot(),
    FormsModule,
    ShareButtonsModule.forRoot(),
    OrderByModule,
    StarringModule,
    ModalModule,
    StargazersModule
  ],
  providers: [
    HighlightJsService,
    ErrorService,
    DateService,
    FileService,
    ToolLaunchService,
    DockerfileService,
    ParamfilesService,
    RefreshService,
    RegisterToolService,
    WorkflowService,
    StarringService,
    VersionModalService,
    InfoTabService
  ],
  exports: [
    ContainerComponent
  ]
})
export class ContainerModule {
}
