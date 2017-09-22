import { RefreshOrganizationComponent } from './../shared/refresh-organization/refresh-organization.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HeaderModule } from '../shared/modules/header.module';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { RefreshWorkflowOrganizationComponent } from './../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { RegisterWorkflowModalComponent } from './../workflow/register-workflow-modal/register-workflow-modal.component';
import { MyWorkflowsComponent } from './myworkflows.component';
import { myworkflowRouting } from './myworkflows.routing';

@NgModule({
  declarations: [
    MyWorkflowsComponent,
    RegisterWorkflowModalComponent,
    RefreshWorkflowOrganizationComponent,
    RefreshOrganizationComponent // Have to add this extended component to appease compiler
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
