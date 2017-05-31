import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from 'angular2-highlight-js';
import { MarkdownModule } from 'angular2-markdown';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';

/* Component */
import { VersionsWorkflowComponent } from '../../workflow/versions/versions.component';
import { FilesWorkflowComponent } from '../../workflow/files/files.component';
import { DescriptorsWorkflowComponent } from '../../workflow/descriptors/descriptors.component';
import { ParamfilesWorkflowComponent } from '../../workflow/paramfiles/paramfiles.component';
import { WorkflowComponent } from '../../workflow/workflow.component';

/* Module */
import { HeaderModule } from '../modules/header.module';
import { ListWorkflowsModule } from '../modules/list-workflows.module';
import { ParamfilesModule } from '../modules/paramfiles.module';
import { SelectModule } from '../modules/select.module';

@NgModule({
  declarations: [
    WorkflowComponent,
    DescriptorsWorkflowComponent,
    FilesWorkflowComponent,
    ParamfilesWorkflowComponent,
    VersionsWorkflowComponent
  ],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HeaderModule,
    HighlightJsModule,
    ListWorkflowsModule,
    ParamfilesModule,
    SelectModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
  ]
})
export class WorkflowModule { }
