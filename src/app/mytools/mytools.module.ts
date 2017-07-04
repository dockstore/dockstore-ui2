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
import { ContainerWebService } from './../shared/webservice/containerWeb.service';
import { HeaderModule } from '../shared/modules/header.module';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';
import { RegisterToolComponent } from './../container/register-tool/register-tool.component';
import { UsersService } from './../shared/webservice/users.service';

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
    ContainerWebService,
    UsersService
  ],
})
export class MyToolsModule {}
