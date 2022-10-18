import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MyBioWorkflowsService } from 'app/myworkflows/my-bio-workflows.service';
import { MyServicesService } from 'app/myworkflows/my-services.service';
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

const DECLARATIONS: any[] = [
  MyWorkflowComponent,
  RefreshWorkflowOrganizationComponent,
  RegisterWorkflowModalComponent,
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
];

/**
 * This is a shared module between the My Workflows page and the My Services page.
 * It shares modules and components
 *
 * @export
 * @class SharedWorkflowServicesModule
 */
@NgModule({
  declarations: DECLARATIONS,
  imports: IMPORTS,
  providers: [MyWorkflowsService, MyBioWorkflowsService, MyServicesService],
  exports: [DECLARATIONS.concat(IMPORTS), SidebarAccordionComponent],
})
export class SharedWorkflowServicesModule {}
