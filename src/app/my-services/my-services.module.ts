import { NgModule } from '@angular/core';
import { SharedWorkflowServicesNotebooksModule } from '../shared-workflow-services-notebooks/shared-workflow-services-notebooks.module';
import { MyServicesRoutes } from './my-services.routing';

@NgModule({
  imports: [MyServicesRoutes, SharedWorkflowServicesNotebooksModule],
})
export class MyServicesModule {}
