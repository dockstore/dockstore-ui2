import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownModule } from 'angular2-markdown';
import { HeaderModule } from '../shared/modules/header.module';
import { ListWorkflowsModule } from '../shared/modules/list-workflows.module';
import { ParamfilesModule } from '../shared/modules/paramfiles.module';
import { SelectModule } from '../shared/modules/select.module';
import { TabModule } from '../shared/modules/tabs.module';
import { WorkflowComponent } from '../workflow/workflow.component';
import { SearchWorkflowsComponent } from './search/search.component';

import { WorkflowsComponent } from './workflows.component';

import { workflowsRouting } from './workflows.routing';

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
export class WorkflowsModule {
}
