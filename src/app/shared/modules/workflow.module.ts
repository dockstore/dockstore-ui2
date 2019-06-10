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
import { EntryFileTabComponent } from 'app/entry/entry-file-tab/entry-file-tab.component';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { MarkdownModule } from 'ngx-markdown';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { CurrentCollectionsModule } from '../../entry/current-collections.module';
import { AddEntryModule } from '../../organizations/collection/add-entry.module';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { StargazersModule } from '../../stargazers/stargazers.module';
import { StarringModule } from '../../starring/starring.module';
import { DescriptorsWorkflowComponent } from '../../workflow/descriptors/descriptors.component';
import { FilesWorkflowComponent } from '../../workflow/files/files.component';
import { LaunchThirdPartyComponent } from '../../workflow/launch-third-party/launch-third-party.component';
import { LaunchWorkflowComponent } from '../../workflow/launch/launch.component';
import { WorkflowLaunchService } from '../../workflow/launch/workflow-launch.service';
import { ParamfilesWorkflowComponent } from '../../workflow/paramfiles/paramfiles.component';
import { PermissionsComponent } from '../../workflow/permissions/permissions.component';
import { VersionsWorkflowComponent } from '../../workflow/versions/versions.component';
import { ViewWorkflowComponent } from '../../workflow/view/view.component';
import { WorkflowFileEditorComponent } from '../../workflow/workflow-file-editor/workflow-file-editor.component';
import { WorkflowComponent } from '../../workflow/workflow.component';
import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { HeaderModule } from '../modules/header.module';
import { ListWorkflowsModule } from '../modules/list-workflows.module';
import { SelectModule } from '../modules/select.module';
import { PipeModule } from '../pipe/pipe.module';
import { DagModule } from './../../workflow/dag/dag.module';
import { InfoTabComponent } from './../../workflow/info-tab/info-tab.component';
import { InfoTabService } from './../../workflow/info-tab/info-tab.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { ToolTabComponent } from './../../workflow/tool-tab/tool-tab.component';
import { VersionModalComponent } from './../../workflow/version-modal/version-modal.component';
import { VersionModalService } from './../../workflow/version-modal/version-modal.service';
import { EntryModule } from './../entry/entry.module';
import { CustomMaterialModule } from './../modules/material.module';
import { RefreshService } from './../refresh.service';
import { getTooltipConfig } from './../tooltip';

@NgModule({
  declarations: [
    WorkflowComponent,
    DescriptorsWorkflowComponent,
    FilesWorkflowComponent,
    WorkflowFileEditorComponent,
    ParamfilesWorkflowComponent,
    VersionsWorkflowComponent,
    LaunchThirdPartyComponent,
    LaunchWorkflowComponent,
    PermissionsComponent,
    ViewWorkflowComponent,
    VersionModalComponent,
    InfoTabComponent,
    ToolTabComponent,
    EntryFileTabComponent
  ],
  imports: [
    CommonModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    CurrentCollectionsModule,
    FlexLayoutModule,
    HeaderModule,
    ListWorkflowsModule,
    ModalModule.forRoot(),
    SelectModule,
    PipeModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    StarringModule,
    OrderByModule,
    FormsModule,
    DagModule,
    StargazersModule,
    ClipboardModule,
    EntryModule,
    AddEntryModule,
    MarkdownModule
  ],
  providers: [
    { provide: TooltipConfig, useFactory: getTooltipConfig },
    DateService,
    FileService,
    WorkflowLaunchService,
    ParamfilesService,
    InfoTabService,
    RefreshService,
    RegisterWorkflowModalService,
    VersionModalService
  ],
  exports: [
    WorkflowComponent,
    CustomMaterialModule,
    EntryModule,
    HeaderModule,
    CommonModule
  ],
  entryComponents: [VersionModalComponent]
})
export class WorkflowModule { }
