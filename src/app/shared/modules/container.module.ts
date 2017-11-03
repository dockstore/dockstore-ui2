/*
 *    Copyright 2017 OICR
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TooltipConfig } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { ShareButtonsModule } from 'ngx-sharebuttons';

import { ContainerComponent } from '../../container/container.component';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { ToolDescriptorService } from '../../container/descriptors/tool-descriptor.service';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { FilesContainerComponent } from '../../container/files/files.component';
import { LaunchComponent } from '../../container/launch/launch.component';
import { ToolLaunchService } from '../../container/launch/tool-launch.service';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { StargazersModule } from '../../stargazers/stargazers.module';
import { StarringModule } from '../../starring/starring.module';
import { StarringService } from '../../starring/starring.service';
import { HighlightJsModule, HighlightJsService } from '../angular2-highlight-js/lib/highlight-js.module';
import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { WorkflowService } from '../workflow.service';
import { AddTagComponent } from './../../container/add-tag/add-tag.component';
import { ModalComponent } from './../../container/deregister-modal/deregister-modal.component';
import { InfoTabComponent } from './../../container/info-tab/info-tab.component';
import { InfoTabService } from './../../container/info-tab/info-tab.service';
import { RegisterToolService } from './../../container/register-tool/register-tool.service';
import { VersionModalComponent } from './../../container/version-modal/version-modal.component';
import { VersionModalService } from './../../container/version-modal/version-modal.service';
import { ErrorService } from './../../shared/error.service';
import { ExtendedToolService } from './../extended-tool.service';
import { getTooltipConfig } from './../../shared/tooltip';
import { PrivateIconModule } from './../private-icon/private-icon.module';
import { RefreshService } from './../refresh.service';
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
    PrivateIconModule,
    StarringModule,
    ModalModule,
    StargazersModule
  ],
  providers: [
    {provide: TooltipConfig, useFactory: getTooltipConfig},
    HighlightJsService,
    ErrorService,
    DateService,
    FileService,
    ToolLaunchService,
    ParamfilesService,
    RefreshService,
    RegisterToolService,
    WorkflowService,
    StarringService,
    VersionModalService,
    InfoTabService,
    ToolDescriptorService,
    ExtendedToolService
  ],
  exports: [
    ContainerComponent
  ]
})
export class ContainerModule {
}
