import { ModalComponent } from './../../container/deregister-modal/deregister-modal.component';
import { RegisterToolService } from './../../container/register-tool/register-tool.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RefreshService } from './../refresh.service';
import { ContainerTagsService } from './../containerTags.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { ClipboardModule } from 'ngx-clipboard';
import { DataTablesModule } from 'angular-datatables';
import { HighlightJsModule, HighlightJsService } from '../angular2-highlight-js/lib/highlight-js.module';
import { MarkdownModule } from 'angular2-markdown';

/* External Library */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { ShareButtonsModule } from 'ngx-sharebuttons';

import { ContainerComponent } from '../../container/container.component';
import { ContainerService } from '../container.service';
import { DescriptorsComponent } from '../../container/descriptors/descriptors.component';
import { DockerfileComponent } from '../../container/dockerfile/dockerfile.component';
import { DockerfileService } from '../../container/dockerfile/dockerfile.service';
import { FilesContainerComponent } from '../../container/files/files.component';
import { LaunchComponent } from '../../container/launch/launch.component';
import { LaunchService } from '../../container/launch/launch.service';
import { ParamfilesComponent } from '../../container/paramfiles/paramfiles.component';
import { ParamfilesService } from '../../container/paramfiles/paramfiles.service';
import { VersionsContainerComponent } from '../../container/versions/versions.component';
import { ViewContainerComponent } from '../../container/view/view.component';
import { ViewService } from '../../container/view/view.service';
import { WorkflowService } from '../workflow.service';

import { DateService } from '../date.service';
import { FileService } from '../file.service';
import { HeaderModule } from './header.module';
import { ListContainersModule } from './list-containers.module';
import { ParamfilesModule } from './paramfiles.module';
import { SelectModule } from './select.module';
import { OrderByModule } from '../../shared/modules/orderby.module';


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
    ModalComponent
  ],
  imports: [
    ButtonsModule.forRoot(),
    CommonModule,
    ClipboardModule,
    MarkdownModule.forRoot(),
    DataTablesModule.forRoot(),
    HighlightJsModule,
    HeaderModule,
    SelectModule,
    ListContainersModule,
    ParamfilesModule,
    TooltipModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    ShareButtonsModule.forRoot(),
    OrderByModule,
    ModalModule
  ],
  providers: [
    HighlightJsService,
    ContainerTagsService,
    DateService,
    FileService,
    ContainerService,
    LaunchService,
    DockerfileService,
    ParamfilesService,
    RefreshService,
    RegisterToolService,
    WorkflowService,
    ViewService
  ],
  exports: [
    ContainerComponent
  ]
})
export class ContainerModule {
}
