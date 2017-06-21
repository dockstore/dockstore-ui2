import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
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
import { LaunchWorkflowComponent } from '../../workflow/launch/launch.component';
import { ViewWorkflowComponent } from '../../workflow/view/view.component';

/* Module */
import { HeaderModule } from '../modules/header.module';
import { ListWorkflowsModule } from '../modules/list-workflows.module';
import { ParamfilesModule } from '../modules/paramfiles.module';
import { SelectModule } from '../modules/select.module';
import { DagModule } from './../../workflow/dag/dag.module';
/* Service */
import { LaunchService } from '../../container/launch/launch.service';
import { ContainerService } from '../container.service';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { ViewService } from '../../container/view/view.service';
import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { WorkflowService } from '../../shared/workflow.service';
import { DescriptorsService } from '../../container/descriptors/descriptors.service';
import { OrderByModule } from '../../shared/modules/orderby.module';


@NgModule({
  declarations: [
    WorkflowComponent,
    DescriptorsWorkflowComponent,
    FilesWorkflowComponent,
    ParamfilesWorkflowComponent,
    VersionsWorkflowComponent,
    LaunchWorkflowComponent,
    ViewWorkflowComponent
  ],
  imports: [
    CommonModule,
    AlertModule.forRoot(),
    MarkdownModule.forRoot(),
    DataTablesModule,
    HeaderModule,
    HighlightJsModule,
    ListWorkflowsModule,
    ParamfilesModule,
    SelectModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    OrderByModule,
    DagModule
  ],
  providers: [
    HighlightJsService,
    DateService,
    FileService,
    ContainerService,
    LaunchService,
    ViewService,
    DockerfileService,
    ParamfilesService,
    WorkflowService,
    DescriptorsService
  ],
  exports: [
    WorkflowComponent
  ]
})
export class WorkflowModule { }
