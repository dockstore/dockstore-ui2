import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FooComponent } from '../foo/foo.component';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* Module */
import { WorkflowModule } from '../shared/modules/workflow.module';
import { MyWorkflowsComponent } from './myworkflows.component';
import { myworkflowRouting } from './myworkflows.routing';
import { HeaderModule } from '../shared/modules/header.module';
import { FooModule } from '../foo/foo.module';

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
    TooltipModule.forRoot(),
    FooModule
  ]
})
export class MyWorkflowsModule { }
