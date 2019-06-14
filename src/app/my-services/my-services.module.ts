import { NgModule } from '@angular/core';
import { SharedWorkflowServicesModule } from '../shared-workflow-services/shared-workflow-services.module';
import { RegisterWorkflowModalComponent } from '../workflow/register-workflow-modal/register-workflow-modal.component';
import { MyServicesRoutes } from './my-services.routing';

@NgModule({
  imports: [
    MyServicesRoutes,
    SharedWorkflowServicesModule,
  ],
  entryComponents: [RegisterWorkflowModalComponent],
})
export class MyServicesModule { }
