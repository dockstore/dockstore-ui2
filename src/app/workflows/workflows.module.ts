/*
 *    Copyright 2017 OICR
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
import { NgModule } from '@angular/core';
import { SharedWorkflowServicesModule } from 'app/shared-workflow-services/shared-workflow-services.module';
import { ListWorkflowsModule } from '../shared/modules/list-workflows.module';
import { SearchWorkflowsComponent } from './search/search.component';
import { WorkflowsComponent } from './workflows.component';
import { workflowsRouting } from './workflows.routing';
import { WorkflowModule } from 'app/shared/modules/workflow.module';
import { WorkflowsPageModule } from 'app/shared/modules/workflowsPage.module';

@NgModule({
  declarations: [SearchWorkflowsComponent],
  imports: [ListWorkflowsModule, workflowsRouting, WorkflowsPageModule]
})
export class WorkflowsModule {}
