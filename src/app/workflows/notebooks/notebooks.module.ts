import { NgModule } from '@angular/core';
import { WorkflowsPageModule } from 'app/shared/modules/workflowsPage.module';
import { NotebooksRoutes } from './notebooks.routing';

@NgModule({
  imports: [WorkflowsPageModule, NotebooksRoutes],
})
export class NotebooksModule {}
