import { RefreshOrganizationComponent } from './../shared/refresh-organization/refresh-organization.component';
import {
    RefreshToolOrganizationComponent,
} from '../container/refresh-tool-organization/refresh-tool-organization.component';
import { RegisterToolService } from './../container/register-tool/register-tool.service';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* Inner Module, Component, Routing, and Service */
import { ContainerModule } from '../shared/modules/container.module';
import { ContainerService } from '../shared/container.service';
import { HeaderModule } from '../shared/modules/header.module';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';
import { RegisterToolComponent } from './../container/register-tool/register-tool.component';

@NgModule({
  declarations: [
    MyToolsComponent,
    RegisterToolComponent,
    RefreshToolOrganizationComponent,
    RefreshOrganizationComponent // Have to add this extended component to appease compiler
  ],
  imports: [
    CommonModule,
    ContainerModule,
    FormsModule,
    HeaderModule,
    mytoolsRouting,
    AccordionModule.forRoot(),
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    RegisterToolService
  ],
})
export class MyToolsModule {}
