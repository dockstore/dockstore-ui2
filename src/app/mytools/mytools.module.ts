import { ContainerWebService } from './../shared/containerWeb.service';
import { RegisterToolComponent } from './../container/register-tool/register-tool.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* Inner Module, Component, Routing, and Service */
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';

import { ContainerModule } from '../shared/modules/container.module';
import { HeaderModule } from '../shared/modules/header.module';
import { ContainerService } from '../shared/container.service';

@NgModule({
  declarations: [
    MyToolsComponent,
    RegisterToolComponent
  ],
  imports: [
    CommonModule,
    ContainerModule,
    FormsModule,
    HeaderModule,
    mytoolsRouting,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  providers: [
    ContainerService,
    ContainerWebService
  ],
})
export class MyToolsModule {}
