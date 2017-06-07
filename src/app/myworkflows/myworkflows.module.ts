import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { WorkflowModule } from '../shared/modules/workflow.module';
import { MyWorkflowsComponent } from './myworkflows.component';
import { myworkflowRouting } from './myworkflows.routing';
import { HeaderModule } from '../shared/modules/header.module';
@NgModule({
  declarations: [
    MyWorkflowsComponent
  ],
  imports: [
    CommonModule,
    WorkflowModule,
    FormsModule,
    HeaderModule,
    myworkflowRouting,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ]
})
export class MyWorkflowsModule { }
