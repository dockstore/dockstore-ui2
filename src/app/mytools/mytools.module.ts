import { RefreshAlertModule } from '../shared/alert/alert.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import {
    RefreshToolOrganizationComponent,
} from '../container/refresh-tool-organization/refresh-tool-organization.component';
import { ContainerModule } from '../shared/modules/container.module';
import { HeaderModule } from '../shared/modules/header.module';
import { RegisterToolComponent } from './../container/register-tool/register-tool.component';
import { RegisterToolService } from './../container/register-tool/register-tool.service';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';

@NgModule({
  declarations: [
    MyToolsComponent,
    RegisterToolComponent,
    RefreshToolOrganizationComponent
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
    TooltipModule.forRoot()
  ],
  providers: [
    RegisterToolService
  ],
})
export class MyToolsModule {}
