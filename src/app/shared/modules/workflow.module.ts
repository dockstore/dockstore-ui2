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

import { ToolTabComponent } from './../../workflow/tool-tab/tool-tab.component';
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
import { ClipboardModule } from 'ngx-clipboard';
import { ShareButtonsModule } from 'ngx-sharebuttons';

import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { WorkflowService } from '../../shared/workflow.service';
import { StargazersModule } from '../../stargazers/stargazers.module';
import { StarringModule } from '../../starring/starring.module';
import { DescriptorsWorkflowComponent } from '../../workflow/descriptors/descriptors.component';
import { WorkflowDescriptorService } from '../../workflow/descriptors/workflow-descriptor.service';
import { FilesWorkflowComponent } from '../../workflow/files/files.component';
import { LaunchWorkflowComponent } from '../../workflow/launch/launch.component';
import { WorkflowLaunchService } from '../../workflow/launch/workflow-launch.service';
import { ParamfilesWorkflowComponent } from '../../workflow/paramfiles/paramfiles.component';
import { VersionsWorkflowComponent } from '../../workflow/versions/versions.component';
import { ViewWorkflowComponent } from '../../workflow/view/view.component';
import { WorkflowComponent } from '../../workflow/workflow.component';
import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { HeaderModule } from '../modules/header.module';
import { ListWorkflowsModule } from '../modules/list-workflows.module';
import { ParamfilesModule } from '../modules/paramfiles.module';
import { SelectModule } from '../modules/select.module';
import { ErrorService } from './../../shared/error.service';
import { DagModule } from './../../workflow/dag/dag.module';
import { InfoTabComponent } from './../../workflow/info-tab/info-tab.component';
import { InfoTabService } from './../../workflow/info-tab/info-tab.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { VersionModalComponent } from './../../workflow/version-modal/version-modal.component';
import { VersionModalService } from './../../workflow/version-modal/version-modal.service';
import { RefreshService } from './../refresh.service';

@NgModule({
  declarations: [
    WorkflowComponent,
    DescriptorsWorkflowComponent,
    FilesWorkflowComponent,
    ParamfilesWorkflowComponent,
    VersionsWorkflowComponent,
    LaunchWorkflowComponent,
    ViewWorkflowComponent,
    VersionModalComponent,
    InfoTabComponent,
    ToolTabComponent
  ],
  imports: [
    CommonModule,
    ButtonsModule.forRoot(),
    AlertModule.forRoot(),
    MarkdownModule.forRoot(),
    DataTablesModule,
    HeaderModule,
    HighlightJsModule,
    ListWorkflowsModule,
    ParamfilesModule,
    ModalModule.forRoot(),
    SelectModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    ShareButtonsModule.forRoot(),
    StarringModule,
    OrderByModule,
    FormsModule,
    DagModule,
    StargazersModule,
    ClipboardModule
  ],
  providers: [
    HighlightJsService,
    DateService,
    FileService,
    WorkflowLaunchService,
    ErrorService,
    ParamfilesService,
    WorkflowService,
    WorkflowDescriptorService,
    InfoTabService,
    RefreshService,
    RegisterWorkflowModalService,
    VersionModalService,
    WorkflowService
  ],
  exports: [
    WorkflowComponent
  ]
})
export class WorkflowModule { }
