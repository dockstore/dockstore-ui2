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
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ClipboardModule } from 'ngx-clipboard';
import { MarkdownModule } from 'ngx-markdown';
import { ContainerComponent } from '../../container/container.component';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { EmailService } from '../../container/email.service';
import { FilesContainerComponent } from '../../container/files/files.component';
import { LaunchComponent } from '../../container/launch/launch.component';
import { ToolLaunchService } from '../../container/launch/tool-launch.service';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { ToolFileEditorComponent } from '../../container/tool-file-editor/tool-file-editor.component';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { CurrentCollectionsModule } from '../../entry/current-collections.module';
import { AddEntryModule } from '../../organizations/collection/add-entry.module';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { StargazersModule } from '../../stargazers/stargazers.module';
import { StarringModule } from '../../starring/starring.module';
import { StarringService } from '../../starring/starring.service';
import { DateService } from '../date.service';
import { ToolActionsComponent } from '../entry-actions/tool-actions.component';
import { FileService } from '../file.service';
import { AddTagComponent } from './../../container/add-tag/add-tag.component';
import { ModalComponent } from './../../container/deregister-modal/deregister-modal.component';
import { InfoTabComponent } from './../../container/info-tab/info-tab.component';
import { InfoTabService } from './../../container/info-tab/info-tab.service';
import { RegisterToolService } from './../../container/register-tool/register-tool.service';
import { VersionModalComponent } from './../../container/version-modal/version-modal.component';
import { VersionModalService } from './../../container/version-modal/version-modal.service';
import { getTooltipConfig } from './../../shared/tooltip';
import { EntryModule } from './../entry/entry.module';
import { CustomMaterialModule } from './../modules/material.module';
import { PrivateIconModule } from './../private-icon/private-icon.module';
import { RefreshService } from './../refresh.service';
import { HeaderModule } from './header.module';
import { ListContainersModule } from './list-containers.module';
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
    ToolActionsComponent,
    AddTagComponent,
    VersionModalComponent,
    InfoTabComponent,
    ToolFileEditorComponent
  ],
  imports: [
    CommonModule,
    ClipboardModule,
    CurrentCollectionsModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    TabsModule.forRoot(),
    FormsModule,
    OrderByModule,
    PrivateIconModule,
    StarringModule,
    ModalModule,
    StargazersModule,
    EntryModule,
    AddEntryModule,
    FlexLayoutModule,
    MarkdownModule
  ],
  providers: [
    EmailService,
    DateService,
    FileService,
    ToolLaunchService,
    ParamfilesService,
    RefreshService,
    RegisterToolService,
    StarringService,
    VersionModalService,
    InfoTabService
  ],
  exports: [ContainerComponent, CustomMaterialModule, EntryModule, ToolActionsComponent],
  entryComponents: [VersionModalComponent, AddTagComponent]
})
export class ContainerModule {}
