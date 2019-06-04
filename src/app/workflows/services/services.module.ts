import { NgModule } from '@angular/core';
import { WorkflowsPageModule } from 'app/shared/modules/workflowsPage.module';
import { ServicesRoutes } from './services.routing';

@NgModule({
  imports: [WorkflowsPageModule, ServicesRoutes]
})
export class ServicesModule {}
