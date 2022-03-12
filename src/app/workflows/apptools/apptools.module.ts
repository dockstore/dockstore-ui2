import { NgModule } from '@angular/core';
import { WorkflowsPageModule } from '../../shared/modules/workflowsPage.module';
import { AppToolsRoutes } from './apptools.routing';

@NgModule({
  declarations: [],
  imports: [WorkflowsPageModule, AppToolsRoutes],
})
export class AppToolsModule {}
