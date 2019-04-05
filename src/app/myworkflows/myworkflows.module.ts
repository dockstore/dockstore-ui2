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
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { HeaderModule } from '../shared/modules/header.module';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { getTooltipConfig } from './../shared/tooltip';
import {
  RefreshWorkflowOrganizationComponent,
} from './../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { RegisterWorkflowModalComponent } from './../workflow/register-workflow-modal/register-workflow-modal.component';
import { MyWorkflowComponent } from './my-workflow/my-workflow.component';
import { MyWorkflowsComponent } from './myworkflows.component';
import { myworkflowRouting } from './myworkflows.routing';
import { SidebarAccordionComponent } from './sidebar-accordion/sidebar-accordion.component';

@NgModule({
  declarations: [
    MyWorkflowsComponent,
    RegisterWorkflowModalComponent,
    RefreshWorkflowOrganizationComponent,
    MyWorkflowComponent,
    SidebarAccordionComponent
],
  imports: [
    CommonModule,
    WorkflowModule,
    FormsModule,
    HeaderModule,
    myworkflowRouting,
    ModalModule.forRoot(),
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CustomMaterialModule,
    PipeModule
  ],
  entryComponents: [RegisterWorkflowModalComponent],
  providers: [
    {provide: TooltipConfig, useFactory: getTooltipConfig},
  ]
})
export class MyWorkflowsModule { }
