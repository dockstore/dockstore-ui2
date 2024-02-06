import { NgModule } from '@angular/core';
import { SharedWorkflowServicesNotebooksModule } from '../shared-workflow-services-notebooks/shared-workflow-services-notebooks.module';
import { MyNotebooksRoutes } from './my-notebooks.routing';

@NgModule({
  imports: [MyNotebooksRoutes, SharedWorkflowServicesNotebooksModule],
})
export class MyNotebooksModule {}
