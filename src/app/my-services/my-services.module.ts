import { NgModule } from '@angular/core';
import { SharedWorkflowServicesModule } from '../shared-workflow-services/shared-workflow-services.module';
import { MyServicesRoutes } from './my-services.routing';

@NgModule({
  imports: [MyServicesRoutes, SharedWorkflowServicesModule]
})
export class MyServicesModule {}
