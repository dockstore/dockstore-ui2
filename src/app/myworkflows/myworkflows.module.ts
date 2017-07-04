import { ModalModule } from 'ngx-bootstrap/modal';
import { RegisterWorkflowModalComponent } from './../workflow/register-workflow-modal/register-workflow-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

/* Bootstrap */
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

/* Module */
import { WorkflowModule } from '../shared/modules/workflow.module';
import { MyWorkflowsComponent } from './myworkflows.component';
import { myworkflowRouting } from './myworkflows.routing';
import { HeaderModule } from '../shared/modules/header.module';

@NgModule({
  declarations: [
    MyWorkflowsComponent,
    RegisterWorkflowModalComponent
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
    TooltipModule.forRoot()
  ]
})
export class MyWorkflowsModule { }
