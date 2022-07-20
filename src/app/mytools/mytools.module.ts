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
import { FormsModule } from '@angular/forms';
import { RefreshWizardModule } from 'app/container/refresh-wizard.module';
import { MyEntriesModule } from 'app/shared/modules/my-entries.module';
import { RefreshToolOrganizationComponent } from '../container/refresh-tool-organization/refresh-tool-organization.component';
import { ContainerModule } from '../shared/modules/container.module';
import { HeaderModule } from '../shared/modules/header.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { RegisterToolService } from './../container/register-tool/register-tool.service';
import { AccountsService } from './../loginComponents/accounts/external/accounts.service';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { MyToolComponent } from './my-tool/my-tool.component';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';
import { MytoolsService } from './mytools.service';
import { SidebarAccordionComponent } from './sidebar-accordion/sidebar-accordion.component';
import { SharedWorkflowServicesModule } from '../shared-workflow-services/shared-workflow-services.module';
import { IsAppToolPipe } from '../search/is-app-tool.pipe';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { MySidebarModule } from '../shared/modules/my-sidebar.module';

@NgModule({
  declarations: [MyToolsComponent, RefreshToolOrganizationComponent, MyToolComponent, SidebarAccordionComponent],
  imports: [
    CommonModule,
    ContainerModule,
    FormsModule,
    HeaderModule,
    mytoolsRouting,
    CustomMaterialModule,
    PipeModule,
    MyEntriesModule,
    RefreshWizardModule,
    SharedWorkflowServicesModule,
    WorkflowModule,
    MySidebarModule,
  ],
  providers: [RegisterToolService, AccountsService, MytoolsService, IsAppToolPipe],
})
export class MyToolsModule {}
