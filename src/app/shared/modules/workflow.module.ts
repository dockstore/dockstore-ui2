import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { RefreshService } from './../refresh.service';
import { RegisterWorkflowModalService } from './../../workflow/register-workflow-modal/register-workflow-modal.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from '../../shared/angular2-highlight-js/lib/highlight-js.module';
import { MarkdownModule } from 'angular2-markdown';
import { StarringModule } from '../../starring/starring.module';
import { ClipboardModule } from 'ngx-clipboard';
/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ShareButtonsModule } from 'ngx-sharebuttons';

/* Component */
import { VersionsWorkflowComponent } from '../../workflow/versions/versions.component';
import { FilesWorkflowComponent } from '../../workflow/files/files.component';
import { DescriptorsWorkflowComponent } from '../../workflow/descriptors/descriptors.component';
import { ParamfilesWorkflowComponent } from '../../workflow/paramfiles/paramfiles.component';
import { WorkflowComponent } from '../../workflow/workflow.component';
import { LaunchWorkflowComponent } from '../../workflow/launch/launch.component';
import { ViewWorkflowComponent } from '../../workflow/view/view.component';
import { ToolTabComponent } from './../../workflow/tool-tab/tool-tab.component';
import { VersionModalComponent } from './../../workflow/version-modal/version-modal.component';
import { InfoTabComponent } from './../../workflow/info-tab/info-tab.component';

/* Module */
import { HeaderModule } from '../modules/header.module';
import { ListWorkflowsModule } from '../modules/list-workflows.module';
import { ParamfilesModule } from '../modules/paramfiles.module';
import { SelectModule } from '../modules/select.module';
import { DagModule } from './../../workflow/dag/dag.module';

/* Service */
import { VersionModalService } from './../../workflow/version-modal/version-modal.service';
import { ErrorService } from './../../container/error.service';
import { InfoTabService } from './../../workflow/info-tab/info-tab.service';
import { LaunchService } from '../../workflow/launch/launch.service';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { WorkflowService } from '../../shared/workflow.service';
import { DescriptorsService } from '../../container/descriptors/descriptors.service';
import { OrderByModule } from '../../shared/modules/orderby.module';
import { StargazersModule } from '../../stargazers/stargazers.module';


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
    LaunchService,
    ErrorService,
    DockerfileService,
    ParamfilesService,
    WorkflowService,
    DescriptorsService,
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
