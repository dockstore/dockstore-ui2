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
import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { FormsModule } from '@angular/forms';

import { MarkdownModule } from 'ngx-markdown';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { CurrentCollectionsModule } from '../../entry/current-collections.module';
import { AddEntryModule } from '../../organizations/collection/add-entry.module';

import { SourceFileTabsComponent } from '../../source-file-tabs/source-file-tabs.component';
import { NotebookComponent } from '../../notebook/notebook.component';
import { NotebookMimeBundleOutputComponent } from '../../notebook/notebook-mime-bundle-output.component';
import { NotebookStreamOutputComponent } from '../../notebook/notebook-stream-output.component';
import { NotebookMarkdownComponent } from '../../notebook/notebook-markdown.component';
import { NotebookSourceComponent } from '../../notebook/notebook-source.component';
import { StargazersModule } from '../../stargazers/stargazers.module';
import { StarringModule } from '../../starring/starring.module';
import { FilterCloudInstancesPipe } from '../../workflow/launch-third-party/filterCloudInstances.pipe';
import { LaunchThirdPartyComponent } from '../../workflow/launch-third-party/launch-third-party.component';
import { MultiCloudLaunchComponent } from '../../workflow/launch-third-party/multi-cloud-launch/multi-cloud-launch.component';
import { LaunchWorkflowComponent } from '../../workflow/launch/launch.component';
import { WorkflowLaunchService } from '../../workflow/launch/workflow-launch.service';
import { PermissionsComponent } from '../../workflow/permissions/permissions.component';
import { VersionsWorkflowComponent } from '../../workflow/versions/versions.component';
import { ViewWorkflowComponent } from '../../workflow/view/view.component';
import { WorkflowFileEditorComponent } from '../../workflow/workflow-file-editor/workflow-file-editor.component';
import { WorkflowComponent } from '../../workflow/workflow.component';

import { DateService } from '../date.service';
import { WorkflowActionsComponent } from '../entry-actions/workflow-actions.component';
import { FileService } from '../file.service';

import { ListWorkflowsModule } from '../modules/list-workflows.module';

import { PipeModule } from '../pipe/pipe.module';
import { DagModule } from './../../workflow/dag/dag.module';
import { InfoTabComponent } from './../../workflow/info-tab/info-tab.component';
import { InfoTabService } from './../../workflow/info-tab/info-tab.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { ToolTabComponent } from './../../workflow/tool-tab/tool-tab.component';
import { VersionModalComponent } from './../../workflow/version-modal/version-modal.component';
import { VersionModalService } from './../../workflow/version-modal/version-modal.service';
import { ExecutionsTabComponent } from '../../workflow/executions/executions-tab.component';
import { EntryModule } from './../entry/entry.module';

import { RefreshService } from './../refresh.service';
import { MarkdownWrapperModule } from './markdown-wrapper.module';

import { SourceFileTabsService } from '../../source-file-tabs/source-file-tabs.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  imports: [
    CommonModule,
    CurrentCollectionsModule,
    FlexLayoutModule,
    ListWorkflowsModule,
    PipeModule,
    StarringModule,
    FormsModule,
    DagModule,
    StargazersModule,
    ClipboardModule,
    EntryModule,
    AddEntryModule,
    MarkdownModule,
    MarkdownWrapperModule,
    NgxMatSelectSearchModule,
    WorkflowComponent,
    WorkflowFileEditorComponent,
    VersionsWorkflowComponent,
    LaunchThirdPartyComponent,
    LaunchWorkflowComponent,
    PermissionsComponent,
    ViewWorkflowComponent,
    VersionModalComponent,
    WorkflowActionsComponent,
    InfoTabComponent,
    ExecutionsTabComponent,
    ToolTabComponent,
    SourceFileTabsComponent,
    NotebookComponent,
    NotebookMimeBundleOutputComponent,
    NotebookStreamOutputComponent,
    NotebookMarkdownComponent,
    NotebookSourceComponent,
    FilterCloudInstancesPipe,
    MultiCloudLaunchComponent,
    ExecutionsTabComponent,
  ],
  providers: [
    DateService,
    FileService,
    WorkflowLaunchService,
    ParamfilesService,
    InfoTabService,
    RefreshService,
    RegisterWorkflowModalService,
    VersionModalService,
    SourceFileTabsService,
  ],
  exports: [WorkflowComponent, EntryModule, CommonModule, WorkflowActionsComponent, FilterCloudInstancesPipe],
})
export class WorkflowModule {}
