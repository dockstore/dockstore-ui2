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

import { HeaderModule } from '../shared/modules/header.module';
import { ListWorkflowsModule } from '../shared/modules/list-workflows.module';
import { ParamfilesModule } from '../shared/modules/paramfiles.module';
import { SelectModule } from '../shared/modules/select.module';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { WorkflowComponent } from '../workflow/workflow.component';
import { SearchWorkflowsComponent } from './search/search.component';

import { WorkflowsComponent } from './workflows.component';

import { workflowsRouting } from './workflows.routing';
import { WorkflowService } from '../shared/workflow.service';

@NgModule({
  declarations: [
    WorkflowsComponent,
    SearchWorkflowsComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    ListWorkflowsModule,
    MarkdownModule.forRoot(),
    SelectModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ParamfilesModule,
    WorkflowModule,
    workflowsRouting
  ],
  providers: [
    HighlightJsService,
    WorkflowService
  ]
})
export class WorkflowsModule {
}
