import { NgModule } from '@angular/core';
import { ListWorkflowsModule } from 'app/shared/modules/list-workflows.module';
import { WorkflowsPageModule } from 'app/shared/modules/workflowsPage.module';
import { ServicesRoutes } from './services.routing';

@NgModule({
  imports: [ListWorkflowsModule, WorkflowsPageModule, ServicesRoutes]
})
export class ServicesModule {}
