/*
 *    Copyright 2022 OICR, UCSC
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
import { RouterModule } from '@angular/router';
import { MyWorkflowsService } from 'app/myworkflows/myworkflows.service';
import { EntryWizardModule } from 'app/shared/entry-wizard.module';
import { MyEntriesModule } from 'app/shared/modules/my-entries.module';
import { MyWorkflowComponent } from '../myworkflows/my-workflow/my-workflow.component';
import { SidebarAccordionComponent } from '../myworkflows/sidebar-accordion/sidebar-accordion.component';
import { RefreshAlertModule } from '../shared/alert/alert.module';
import { HeaderModule } from '../shared/modules/header.module';
import { CustomMaterialModule } from '../shared/modules/material.module';
import { WorkflowModule } from '../shared/modules/workflow.module';
import { PipeModule } from '../shared/pipe/pipe.module';
import { RefreshWorkflowOrganizationComponent } from '../workflow/refresh-workflow-organization/refresh-workflow-organization.component';
import { RegisterWorkflowModalComponent } from '../workflow/register-workflow-modal/register-workflow-modal.component';
import { RegisterGithubAppModalComponent } from 'app/workflow/register-workflow-modal/register-github-app-modal/register-github-app-modal.component';
import { PreviewWarningModule } from 'app/shared/modules/preview-warning.module';

const DECLARATIONS: any[] = [
  MyWorkflowComponent,
  RefreshWorkflowOrganizationComponent,
  RegisterWorkflowModalComponent,
  RegisterGithubAppModalComponent,
  SidebarAccordionComponent,
];
const IMPORTS = [
  FormsModule,
  WorkflowModule,
  HeaderModule,
  CustomMaterialModule,
  RefreshAlertModule,
  PipeModule,
  CommonModule,
  RouterModule,
  MyEntriesModule,
  EntryWizardModule,
  PreviewWarningModule,
];

/**
 * This is a shared module between the My Workflows page, My Services page, and My Notebooks page.
 * It shares modules and components
 *
 * @export
 * @class SharedWorkflowServicesNotebooksModule
 */
@NgModule({
  declarations: DECLARATIONS,
  imports: IMPORTS,
  providers: [MyWorkflowsService],
  exports: [DECLARATIONS.concat(IMPORTS), SidebarAccordionComponent],
})
export class SharedWorkflowServicesNotebooksModule {}
