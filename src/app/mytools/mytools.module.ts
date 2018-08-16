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

import {
  RefreshToolOrganizationComponent,
} from '../container/refresh-tool-organization/refresh-tool-organization.component';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { ContainerModule } from '../shared/modules/container.module';
import { HeaderModule } from '../shared/modules/header.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { RegisterToolComponent } from './../container/register-tool/register-tool.component';
import { RegisterToolService } from './../container/register-tool/register-tool.service';
import { AccountsService } from './../loginComponents/accounts/external/accounts.service';
import { CustomMaterialModule } from './../shared/modules/material.module';
import { getTooltipConfig } from './../shared/tooltip';
import { MyToolComponent } from './my-tool/my-tool.component';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';
import { SidebarAccordionComponent } from './sidebar-accordion/sidebar-accordion.component';

@NgModule({
  declarations: [
    MyToolsComponent,
    RegisterToolComponent,
    RefreshToolOrganizationComponent,
    MyToolComponent,
    SidebarAccordionComponent
  ],
  imports: [
    CommonModule,
    ContainerModule,
    FormsModule,
    HeaderModule,
    mytoolsRouting,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    RefreshAlertModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CustomMaterialModule,
    PipeModule
  ],
  providers: [
    { provide: TooltipConfig, useFactory: getTooltipConfig },
    RegisterToolService, AccountsService
  ],
})
export class MyToolsModule { }
