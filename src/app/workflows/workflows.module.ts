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
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxMdModule } from 'ngx-md';

import { HeaderModule } from '../shared/modules/header.module';
import { ListWorkflowsModule } from '../shared/modules/list-workflows.module';
import { SelectModule } from '../shared/modules/select.module';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { getTooltipConfig } from './../shared/tooltip';
import { SearchWorkflowsComponent } from './search/search.component';
import { WorkflowsComponent } from './workflows.component';
import { workflowsRouting } from './workflows.routing';

@NgModule({
  declarations: [
    WorkflowsComponent,
    SearchWorkflowsComponent
  ],
  imports: [
    CommonModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    HeaderModule,
    ListWorkflowsModule,
    NgxMdModule.forRoot(),
    SelectModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    WorkflowModule,
    workflowsRouting
  ],
  providers: [
    {provide: TooltipConfig, useFactory: getTooltipConfig}
  ]
})
export class WorkflowsModule {
}
