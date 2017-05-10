import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { MarkdownModule } from 'angular2-markdown';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { HeaderModule } from '../shared/modules/header.module';
import { SelectModule } from '../shared/modules/select.module';
import { ListWorkflowsModule } from '../shared/modules/list-workflows.module';
import { TabModule } from '../shared/modules/tabs.module';
import { ParamfilesModule } from '../shared/modules/paramfiles.module';

import { workflowsRouting } from './workflows.routing';

import { WorkflowsComponent } from './workflows.component';
import { SearchWorkflowsComponent } from './search/search.component';
 import { WorkflowComponent } from '../workflow/workflow.component';

/*
import { VersionsWorkflowComponent } from './versions/versions.component';
import { FilesWorkflowComponent } from './files/files.component';

import { DescriptorsWorkflowComponent } from './descriptors/descriptors.component';
import { ParamfilesWorkflowComponent } from './paramfiles/paramfiles.component';
*/

@NgModule({
  declarations: [
    WorkflowsComponent,
    SearchWorkflowsComponent,
    WorkflowComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListWorkflowsModule,
    TabModule,
    ParamfilesModule,
    workflowsRouting
  ],
  providers: [
    HighlightJsService
  ]
})
export class WorkflowsModule { }
