import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { ContainerModule } from '../shared/modules/container.module';
import { MyToolsComponent } from './mytools.component';
import { mytoolsRouting } from './mytools.routing';
import { HeaderModule } from '../shared/modules/header.module';
import { ToolObservableService } from '../shared/tool-observable.service';

@NgModule({
  declarations: [
    MyToolsComponent
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
    ToolObservableService
  ],
})
export class MyToolsModule {}
